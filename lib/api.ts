import { Client, Product, Supplier } from "@/types/core";
import { Profile, SystemAudit, User, LoginData, RegisterData } from "@/types/personnel";
import { Invoice, Order, OrderJournalEntry } from "@/types/sales";
import { GeneralOptions, FiscalYear } from "@/types/settings";
import { Warehouse, StockMovement, Inventory, WarehouseTransfer, ProductTransformation } from "@/types/stock";
import {
  Account,
  OperationComptable,
  EcritureComptable,
  JournalComptable,
  PeriodeComptable, UUID,
  LedgerSettings, GeneralSettings
} from "@/types/accounting";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

const apiRequest = async <T>(endpoint: string, method: string = 'GET', body?: unknown): Promise<T> => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorInfo;
    try {
      errorInfo = await response.json();
    } catch (e) {
      errorInfo = { message: `Erreur API: ${response.status} ${response.statusText}` };
    }
    throw new Error(errorInfo.message || `Erreur API: ${method} ${endpoint}`);
  }

  if (method === 'DELETE' || response.status === 204) {
    return {} as T;
  }

  return response.json();
};



export const registerUser = async (data: RegisterData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.status === 409) {
    throw new Error('Cet email est déjà utilisé.');
  }

  if (!response.ok) {
    throw new Error("Une erreur s'est produite lors de l'inscription.");
  }

  return response.json();
};


export const loginUser = async (data: LoginData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    throw new Error('Email ou mot de passe invalide.');
  }

  if (!response.ok) {
    throw new Error('Erreur de connexion.');
  }

  return response.json();
};

export const getClients = (query?: string): Promise<Client[]> => apiRequest<Client[]>(`/clients${query ? `?q=${query}` : ''}`);
export const createClient = (data: Omit<Client, 'id'>): Promise<Client> => apiRequest<Client>("/clients", 'POST', data);
export const updateClient = (id: UUID, data: Partial<Client>): Promise<Client> => apiRequest<Client>(`/clients/${id}`, 'PUT', data);
export const deleteClient = (id: UUID): Promise<void> => apiRequest<void>(`/clients/${id}`, 'DELETE');

export const getProducts = (query?: string): Promise<Product[]> => apiRequest<Product[]>(`/products${query ? `?q=${query}` : ''}`);
export const createProduct = (data: Omit<Product, 'id'>): Promise<Product> => apiRequest<Product>("/products", 'POST', data);
export const updateProduct = (id: UUID, data: Partial<Product>): Promise<Product> => apiRequest<Product>(`/products/${id}`, 'PUT', data);
export const deleteProduct = (id: UUID): Promise<void> => apiRequest<void>(`/products/${id}`, 'DELETE');

export const getInvoices = async (): Promise<Invoice[]> => {
  const invoices = await apiRequest<Invoice[]>("/invoices");
  return invoices.map(invoice => ({ ...invoice, orderDate: new Date(invoice.orderDate), dueDate: new Date(invoice.dueDate) }));
};

export const getOrderJournal = async (): Promise<OrderJournalEntry[]> => {
  const journal = await apiRequest<OrderJournalEntry[]>("/orderJournal");
  return journal.map(entry => ({ ...entry, orderDate: new Date(entry.orderDate) }));
};
export const updateOrderJournalEntry = (id: UUID, data: Partial<OrderJournalEntry>): Promise<OrderJournalEntry> => apiRequest<OrderJournalEntry>(`/orderJournal/${id}`, 'PUT', data);
export const deleteOrderJournalEntry = (id: UUID): Promise<void> => apiRequest<void>(`/orderJournal/${id}`, 'DELETE');

export const getOrders = async (): Promise<Order[]> => {
  const orders = await apiRequest<Order[]>("/orders");
  return orders.map(order => ({ ...order, orderDate: new Date(order.orderDate) }));
};
export const createOrder = (data: Omit<Order, 'id'>): Promise<Order> => apiRequest<Order>("/orders", 'POST', data);
export const updateOrder = (id: UUID, data: Partial<Order>): Promise<Order> => apiRequest<Order>(`/orders/${id}`, 'PUT', data);

export const getWarehouses = (): Promise<Warehouse[]> => apiRequest<Warehouse[]>('/warehouses');
export const getStockMovements = (): Promise<StockMovement[]> => apiRequest<StockMovement[]>('/stockMovements');
export const createStockMovement = (data: Omit<StockMovement, 'id'>): Promise<StockMovement> => apiRequest<StockMovement>('/stockMovements', 'POST', data);

export const getWarehouseTransfers = (): Promise<WarehouseTransfer[]> => apiRequest<WarehouseTransfer[]>('/warehouseTransfers');
export const createWarehouseTransfer = (data: Omit<WarehouseTransfer, 'id'>): Promise<WarehouseTransfer> => apiRequest<WarehouseTransfer>('/warehouseTransfers', 'POST', data);

export const getProductTransformations = (): Promise<ProductTransformation[]> => apiRequest<ProductTransformation[]>('/productTransformations');
export const createProductTransformation = (data: Omit<ProductTransformation, 'id'>): Promise<ProductTransformation> => apiRequest<ProductTransformation>('/productTransformations', 'POST', data);

export const getInventories = (): Promise<Inventory[]> => apiRequest<Inventory[]>('/inventories');
export const createInventory = (data: Omit<Inventory, 'id'>): Promise<Inventory> => apiRequest<Inventory>('/inventories', 'POST', data);
export const updateInventory = (id: UUID, data: Partial<Inventory>): Promise<Inventory> => apiRequest<Inventory>(`/inventories/${id}`, 'PUT', data);
export const deleteInventory = (id: UUID): Promise<void> => apiRequest<void>(`/inventories/${id}`, 'DELETE');

export const getUsers = (): Promise<User[]> => apiRequest<User[]>('/users');
export const createUser = (data: Omit<User, 'id' | 'creationDate'>): Promise<User> => apiRequest<User>('/users', 'POST', { ...data, creationDate: new Date().toISOString() });
export const updateUser = (id: UUID, data: Partial<User>): Promise<User> => apiRequest<User>(`/users/${id}`, 'PUT', data);

export const getProfiles = (): Promise<Profile[]> => apiRequest<Profile[]>('/profiles');
export const createProfile = (data: Omit<Profile, 'id'>): Promise<Profile> => apiRequest<Profile>('/profiles', 'POST', data);
export const updateProfile = (id: UUID, data: Partial<Profile>): Promise<Profile> => apiRequest<Profile>(`/profiles/${id}`, 'PUT', data);
export const deleteProfile = (id: UUID): Promise<void> => apiRequest<void>(`/profiles/${id}`, 'DELETE');

export const getSystemAudits = (): Promise<SystemAudit[]> => apiRequest<SystemAudit[]>('/systemAudits');

export const getSuppliers = (query?: string): Promise<Supplier[]> => apiRequest<Supplier[]>(`/suppliers${query ? `?q=${query}` : ''}`);
export const createSupplier = (data: Omit<Supplier, 'id'>): Promise<Supplier> => apiRequest<Supplier>("/suppliers", 'POST', data);
export const updateSupplier = (id: UUID, data: Partial<Supplier>): Promise<Supplier> => apiRequest<Supplier>(`/suppliers/${id}`, 'PUT', data);
export const deleteSupplier = (id: UUID): Promise<void> => apiRequest<void>(`/suppliers/${id}`, 'DELETE');

export const getGeneralOptions = async (): Promise<GeneralOptions> => {
  const options = await apiRequest<GeneralOptions[]>('/generalOptions');
  return options[0];
};
export const updateGeneralOptions = (data: GeneralOptions): Promise<GeneralOptions> => apiRequest<GeneralOptions>('/generalOptions/main', 'PUT', data);

//export const getFiscalYears = (): Promise<FiscalYear[]> => apiRequest<FiscalYear[]>('/fiscalYears');
export const createFiscalYear = (data: Omit<FiscalYear, 'id'>): Promise<FiscalYear> => apiRequest<FiscalYear>('/fiscalYears', 'POST', data);
export const updateFiscalYear = (id: UUID, data: Partial<FiscalYear>): Promise<FiscalYear> => apiRequest<FiscalYear>(`/fiscalYears/${id}`, 'PUT', data);

//ACCOUNTING
const API_ACCOUNTING_URL = process.env.NEXT_PUBLIC_ACCOUNTING_API_URL || API_BASE_URL;

const apiAccountingRequest = async <T>(endpoint: string, method: string = 'GET', body?: unknown): Promise<T> => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  console.log(body);
  const response = await fetch(`${API_ACCOUNTING_URL}${endpoint}`, config);
  if (!response.ok) {
    let errorInfo;
    try {
      errorInfo = await response.json();
    } catch (e) {
      errorInfo = { message: `Erreur API: ${errorInfo.status} ${errorInfo.statusText}` };
    }
    throw new Error(errorInfo.message || `Erreur API: ${method} ${endpoint}`);
  }

  if (method === 'DELETE' || response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// PLAN COMPTABLE 
export const getAccounts = (): Promise<Account[]> => apiAccountingRequest<Account[]>('/api/accounting/plan-comptable');
export const createAccount = (data: Omit<Account, 'id'>): Promise<Account> => apiAccountingRequest<Account>('/api/accounting/plan-comptable', 'POST', data);
export const updateAccount = (id: UUID, data: Partial<Account>): Promise<Account> => apiAccountingRequest<Account>(`/api/accounting/plan-comptable/${id}`, 'PUT', data);
export const deleteAccount = (id: UUID): Promise<void> => apiAccountingRequest<void>(`/api/accounting/plan-comptable/${id}`, 'DELETE');

//OPERATIONS COMPTABLES

export const getOperationsComptables = (): Promise<OperationComptable[]> =>
  apiAccountingRequest<OperationComptable[]>('/api/accounting/operation-comptable');

export const createOperationComptable = (data: Omit<OperationComptable, 'id'>): Promise<OperationComptable> =>
  apiAccountingRequest<OperationComptable>('/api/accounting/operation-comptable', 'POST', data);

export const getOperationComptable = (id: UUID): Promise<OperationComptable> =>
  apiAccountingRequest<OperationComptable>(`/api/accounting/operation-comptable/${id}`);

export const updateOperationComptable = (id: UUID, data: Partial<OperationComptable>): Promise<OperationComptable> =>
  apiAccountingRequest<OperationComptable>(`/api/accounting/operation-comptable/${id}`, 'PUT', data);

export const deleteOperationComptable = (id: UUID): Promise<void> =>
  apiAccountingRequest<void>(`/api/accounting/operation-comptable/${id}`, 'DELETE');

export const getOperationByTypeAndMode = (typeOperation: string, modeReglement: string): Promise<OperationComptable> =>
  apiAccountingRequest<OperationComptable>(`/api/accounting/operation-comptable/search?typeOperation=${typeOperation}&modeReglement=${modeReglement}`);




// LEDGER SETTINGS
export const getLedgerSettings = (): Promise<LedgerSettings> =>
  apiAccountingRequest<LedgerSettings>('/api/accounting/ledger-settings');
export const updateLedgerSettings = (data: Partial<LedgerSettings>): Promise<LedgerSettings> =>
  apiAccountingRequest<LedgerSettings>('/api/accounting/ledger-settings', 'PUT', data);

// GENERAL SETTINGS
export const getGeneralSettings = (): Promise<GeneralSettings> =>
  apiAccountingRequest<GeneralSettings>('/api/accounting/general-settings');
export const updateGeneralSettings = (data: Partial<GeneralSettings>): Promise<GeneralSettings> =>
  apiAccountingRequest<GeneralSettings>('/api/accounting/general-settings', 'PUT', data);

// ECRITURES COMPTABLES

export const getEcrituresComptables = (): Promise<EcritureComptable[]> =>
  apiAccountingRequest<EcritureComptable[]>('/api/accounting/ecritures');

export const createEcritureComptable = (data: Omit<EcritureComptable, 'id'>): Promise<EcritureComptable> =>
  apiAccountingRequest<EcritureComptable>('/api/accounting/ecritures', 'POST', data);

export const validateEcritureComptable = (id: UUID, authentication?: string): Promise<EcritureComptable> =>
  apiAccountingRequest<EcritureComptable>(`/api/accounting/ecritures/${id}/validate`, 'POST');

export const getNonValidatedEcritures = (): Promise<EcritureComptable[]> =>
  apiAccountingRequest<EcritureComptable[]>('/api/accounting/ecritures/non-validated');

export const getEcritureComptableById = (id: UUID): Promise<EcritureComptable> =>
  apiAccountingRequest<EcritureComptable>(`/api/accounting/ecritures/${id}`);

export const updateEcritureComptable = (id: UUID, data: Partial<EcritureComptable>): Promise<EcritureComptable> =>
  apiAccountingRequest<EcritureComptable>(`/api/accounting/ecritures/${id}`, 'PUT', data);

export const searchEcritures = (startDate?: Date, endDate?: Date, journalId?: UUID): Promise<EcritureComptable[]> => {
  let url = '/api/accounting/ecritures/search';
  const params: string[] = [];
  if (startDate) params.push(`start=${startDate.toISOString().split('T')[0]}`);
  if (endDate) params.push(`end=${endDate.toISOString().split('T')[0]}`);
  if (journalId) params.push(`journalId=${journalId}`);
  if (params.length) url += `?${params.join('&')}`;
  return apiAccountingRequest<EcritureComptable[]>(url);
};

export const generateEcritureFromObject = (request: { tenantId: UUID; journalComptableId: UUID }): Promise<EcritureComptable> =>
  apiAccountingRequest<EcritureComptable>('/api/accounting/ecritures/generate', 'POST', request);

export const deleteEcritureComptable = (id: UUID): Promise<void> =>
  apiAccountingRequest<void>(`/api/accounting/ecritures/${id}`, 'DELETE');

export const cancelEcritureComptable = (id: UUID): Promise<EcritureComptable> =>
  apiAccountingRequest<EcritureComptable>(`/api/accounting/ecritures/${id}/cancel`, 'PATCH');

//Journal comptables

export const getJounalComptables = (): Promise<JournalComptable[]> =>
  apiAccountingRequest<JournalComptable[]>('/api/accounting/journals');

export const getJournalComptableById = (id: UUID): Promise<JournalComptable> =>
  apiAccountingRequest<JournalComptable>(`/api/accounting/journals/${id}`);

export const getJounalComptableActive = (): Promise<JournalComptable[]> =>
  apiAccountingRequest<JournalComptable[]>('/api/accounting/journals/active');

export const createJournalComptable = (data: Omit<JournalComptable, 'id'>): Promise<JournalComptable> =>
  apiAccountingRequest<JournalComptable>('/api/accounting/journals', 'POST', data);

export const updateJournalComptable = (id: UUID, data: Partial<JournalComptable>): Promise<JournalComptable> =>
  apiAccountingRequest<JournalComptable>(`/api/accounting/journals/${id}`, 'PUT', data);

export const deleteJournalComptable = (id: UUID): Promise<void> =>
  apiAccountingRequest<void>(`/api/accounting/journals/${id}`, 'DELETE');


//Periode comptable 


// PERIODE COMPTABLE
export const getPeriodeComptables = (): Promise<PeriodeComptable[]> =>
  apiAccountingRequest<PeriodeComptable[]>('/api/accounting/periodes');

export const createPeriodeComptable = (data: Omit<PeriodeComptable, 'id'>): Promise<PeriodeComptable> =>
  apiAccountingRequest<PeriodeComptable>('/api/accounting/periodes', 'POST', data);

export const getPeriodeComptableById = (id: UUID): Promise<PeriodeComptable> =>
  apiAccountingRequest<PeriodeComptable>(`/api/accounting/periodes/${id}`);

export const getPeriodeByCode = (code: string): Promise<PeriodeComptable> =>
  apiAccountingRequest<PeriodeComptable>(`/api/accounting/periodes/code/${code}`);

export const getPeriodeByDate = (date: Date): Promise<PeriodeComptable> =>
  apiAccountingRequest<PeriodeComptable>(`/api/accounting/periodes/by-date?date=${date.toISOString().split('T')[0]}`);

export const getNonClosedPeriodes = (): Promise<PeriodeComptable[]> =>
  apiAccountingRequest<PeriodeComptable[]>('/api/accounting/periodes/non-closed');

export const getPeriodesByRange = (startDate: Date, endDate: Date): Promise<PeriodeComptable[]> => {
  if (startDate > endDate) {
    throw new Error("La date de début doit être antérieure ou égale à la date de fin");
  }
  return apiAccountingRequest<PeriodeComptable[]>(
    `/api/accounting/periodes/range?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`
  );
};

export const updatePeriodeComptable = (id: UUID, data: Partial<PeriodeComptable>): Promise<PeriodeComptable> =>
  apiAccountingRequest<PeriodeComptable>(`/api/accounting/periodes/${id}`, 'PUT', data);

export const closePeriodeComptable = (id: UUID): Promise<PeriodeComptable> =>
  apiAccountingRequest<PeriodeComptable>(`/api/accounting/periodes/${id}/close`, 'PUT');

export const deletePeriodeComptable = (id: UUID): Promise<void> =>
  apiAccountingRequest<void>(`/api/accounting/periodes/${id}`, 'DELETE');


// Données statiques pour getEcrituresComptablesSummary
const staticEcrituresSummary = {
  totalDebit: 1500000,
  totalCredit: 1450000,
  pendingEntries: 5,
};

// Données statiques pour getRecentOperations
const staticRecentOperations: OperationComptable[] = [
  {
    id: 'op-001' as UUID,
    typeOperation: 'VENTE',
    modeReglement: 'COMPTANT',
    comptePrincipal: '57000',
    estCompteStatique: true,
    sensPrincipal: 'DEBIT',
    typeMontant: 'TTC',
    journalComptableId: 'journal-001' as UUID,
    plafondClient: 100000,
    actif: true,
    createdAt: new Date('2025-09-14'), // Objet Date
  },
  {
    id: 'op-002' as UUID,
    typeOperation: 'ACHAT',
    modeReglement: 'CREDIT',
    comptePrincipal: '60100',
    estCompteStatique: false,
    sensPrincipal: 'CREDIT',
    typeMontant: 'HT',
    journalComptableId: 'journal-002' as UUID,
    plafondClient: 50000,
    actif: true,
    createdAt: new Date('2025-09-13'), // Objet Date
  },
];

// Données statiques pour getPeriodeComptablesSummary
const staticPeriodSummary: PeriodeComptable[] = [
  {
    id: 'period-001' as UUID,
    code: 'P2025-01',
    cloturee: false,
    createdAt: new Date('2025-09-01'), // Objet Date
  },
  {
    id: 'period-002' as UUID,
    code: 'P2025-02',
    cloturee: true,
    createdAt: new Date('2025-08-01'), // Objet Date
  },
];

// API simulée pour getEcrituresComptablesSummary
export const getEcrituresComptablesSummary = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: staticEcrituresSummary }), 500); // Simule un délai API
  });
};

// API simulée pour getRecentOperations
export const getRecentOperations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: staticRecentOperations }), 500); // Simule un délai API
  });
};

// API simulée pour getPeriodeComptablesSummary
export const getPeriodeComptablesSummary = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: staticPeriodSummary }), 500); // Simule un délai API
  });
};

// API simulée pour generateReport
export const generateReport = async ({ periodeId, reportType }: { periodeId: string; reportType: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let content = '';
      switch (reportType) {
        case 'BALANCE_SHEET':
          content = `Bilan pour la période ${periodeId}\nTotal Actif: 1 200 000\nTotal Passif: 1 150 000`;
          break;
        case 'LEDGER':
          content = `Grand Livre pour ${periodeId}\nCompte 57000: 800 000\nCompte 60100: 450 000`;
          break;
        case 'PERIOD_SUMMARY':
          content = `Résumé pour ${periodeId}\nPériode P2025-01: 800 000\nPériode P2025-02: 700 000`;
          break;
        default:
          content = 'Type de rapport non reconnu.';
      }
      resolve({ data: content });
    }, 1000); // Simule un délai API
  });
};
// lib/api.ts (partial update)

export const getBalanceSheet = async (): Promise<{
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
}> => {
  return Promise.resolve({
    totalAssets: 1500000,
    totalLiabilities: 1200000,
    equity: 300000,
  });
};

export const getProfitAndLoss = async (): Promise<{
  revenue: number;
  expenses: number;
  netProfit: number;
}> => {
  return Promise.resolve({
    revenue: 800000,
    expenses: 600000,
    netProfit: 200000,
  });
};

export const getCashFlow = async (): Promise<{
  operating: number;
  investing: number;
  financing: number;
  netCash: number;
}> => {
  return Promise.resolve({
    operating: 250000,
    investing: -50000,
    financing: 100000,
    netCash: 300000,
  });
};

export const getExecutiveSummary = async (): Promise<{
  annualRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashAvailable: number;
}> => {
  return Promise.resolve({
    annualRevenue: 2000000,
    totalExpenses: 1600000,
    netProfit: 400000,
    cashAvailable: 350000,
  });
};

export const getGeneralLedger = async (): Promise<{
  [account: string]: number;
}> => {
  return Promise.resolve({
    '57000': 800000,
    '60100': 450000,
    '51200': 300000,
  });
};

export const getGeneralBalance = async (): Promise<{
  totalDebit: number;
  totalCredit: number;
  difference: number;
}> => {
  return Promise.resolve({
    totalDebit: 1500000,
    totalCredit: 1500000,
    difference: 0,
  });
};

export const getAudits = async (): Promise<{
  audits: { id: string; date: string; description: string }[];
}> => {
  return Promise.resolve({
    audits: [
      { id: '1', date: '2025-09-01', description: 'Validation des écritures' },
      { id: '2', date: '2025-09-15', description: 'Clôture de la période' },
    ],
  });
};