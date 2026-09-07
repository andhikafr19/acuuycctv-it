import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getStoreFilePath() {
  const parentPath = path.resolve(process.cwd(), '..', 'shared-data', 'store.json');
  if (fs.existsSync(parentPath)) return parentPath;

  const currentPath = path.resolve(process.cwd(), 'shared-data', 'store.json');
  if (fs.existsSync(currentPath)) return currentPath;

  return parentPath;
}

function readStoreData() {
  const filePath = getStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading store.json:', error);
  }
  return { settings: {}, technicians: [], laptops: [], orders: [], submissions: [] };
}

function writeStoreData(data: any) {
  const filePath = getStoreFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing store.json:', error);
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource') || 'all';
  const orderNumber = searchParams.get('order_number');
  const store = readStoreData();

  if (orderNumber) {
    const order = store.orders.find(
      (o: any) => o.order_number.trim().toLowerCase() === orderNumber.trim().toLowerCase()
    );
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: order });
  }

  if (resource === 'all') {
    return NextResponse.json({ data: store });
  }

  if (resource in store) {
    return NextResponse.json({ data: (store as any)[resource] });
  }

  return NextResponse.json({ error: 'Resource tidak valid' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;
    const store = readStoreData();

    if (action === 'create_order') {
      const newOrder = {
        id: 'ord-' + Date.now(),
        order_number: data.order_number,
        service_type: data.service_type,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email || '',
        address: data.address,
        city: data.city || store.settings.city || 'Garut',
        description: data.description,
        specific_details: data.specific_details || {},
        photo_urls: data.photo_urls || [],
        status: 'baru',
        estimated_cost: 0,
        final_cost: 0,
        technician_id: '',
        technician_name: '',
        admin_notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status_logs: [
          {
            status: 'baru',
            time: new Date().toISOString(),
            notes: 'Pemesanan jasa berhasil dibuat melalui website publik',
          },
        ],
      };

      store.orders.unshift(newOrder);
      writeStoreData(store);
      return NextResponse.json({ success: true, data: newOrder });
    }

    if (action === 'create_submission') {
      const newSub = {
        id: 'sub-' + Date.now(),
        submission_number: data.submission_number,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        brand: data.brand,
        model: data.model,
        specifications: data.specifications,
        condition_description: data.condition_description,
        expected_price: Number(data.expected_price) || 0,
        offered_price: 0,
        status: 'menunggu_review',
        admin_notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      store.submissions.unshift(newSub);
      writeStoreData(store);
      return NextResponse.json({ success: true, data: newSub });
    }

    if (action === 'update_order') {
      const index = store.orders.findIndex((o: any) => o.id === data.id);
      if (index !== -1) {
        const prev = store.orders[index];
        const statusChanged = data.status && data.status !== prev.status;
        const updatedLogs = [...(prev.status_logs || [])];
        if (statusChanged) {
          updatedLogs.push({
            status: data.status,
            time: new Date().toISOString(),
            notes: data.log_notes || `Status diubah menjadi ${data.status}`,
          });
        }

        store.orders[index] = {
          ...prev,
          ...data,
          status_logs: updatedLogs,
          updated_at: new Date().toISOString(),
        };
        writeStoreData(store);
        return NextResponse.json({ success: true, data: store.orders[index] });
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'save_laptop') {
      if (data.id) {
        const index = store.laptops.findIndex((l: any) => l.id === data.id);
        if (index !== -1) {
          store.laptops[index] = { ...store.laptops[index], ...data };
        } else {
          store.laptops.push(data);
        }
      } else {
        const newLaptop = {
          ...data,
          id: 'lap-' + Date.now(),
          slug: (data.title || 'laptop')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
        };
        store.laptops.unshift(newLaptop);
      }
      writeStoreData(store);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_laptop') {
      store.laptops = store.laptops.filter((l: any) => l.id !== data.id);
      writeStoreData(store);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_settings') {
      store.settings = { ...store.settings, ...data };
      writeStoreData(store);
      return NextResponse.json({ success: true, data: store.settings });
    }

    if (action === 'update_submission') {
      const index = store.submissions.findIndex((s: any) => s.id === data.id);
      if (index !== -1) {
        store.submissions[index] = {
          ...store.submissions[index],
          ...data,
          updated_at: new Date().toISOString(),
        };
        writeStoreData(store);
        return NextResponse.json({ success: true, data: store.submissions[index] });
      }
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (action === 'save_portfolio') {
      if (!store.portfolios) store.portfolios = [];
      if (data.id) {
        const index = store.portfolios.findIndex((p: any) => p.id === data.id);
        if (index !== -1) {
          store.portfolios[index] = { ...store.portfolios[index], ...data };
        } else {
          store.portfolios.push(data);
        }
      } else {
        const newPort = {
          ...data,
          id: 'port-' + Date.now(),
        };
        store.portfolios.unshift(newPort);
      }
      writeStoreData(store);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_portfolio') {
      if (store.portfolios) {
        store.portfolios = store.portfolios.filter((p: any) => p.id !== data.id);
        writeStoreData(store);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
