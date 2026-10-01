const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/finance/page.tsx', 'utf8');

// Remove import
code = code.replace(/import \{ mockPaymentHistory, mockRoomsByFloor \} from "@\/data\/mock-rooms";/g, 'import { useEffect } from "react";');

// Add fetch logic
code = code.replace(/export default function FinanceDashboard\(\) \{/g, `export default function FinanceDashboard() {
  const [financeData, setFinanceData] = useState<{ totalRevenue: number, pendingDues: number, totalAdvance: number, history: PaymentRecord[] } | null>(null);

  useEffect(() => {
    fetch('/api/finance').then(r => r.json()).then(d => {
      if(d.success) setFinanceData({ totalRevenue: d.totalRevenue, pendingDues: d.pendingDues, totalAdvance: d.totalAdvance, history: d.history });
    });
  }, []);`);

// Replace variables
code = code.replace(/const totalRevenue = mockPaymentHistory[^;]+;/g, 'const totalRevenue = financeData?.totalRevenue || 0;');
code = code.replace(/const pendingDues = mockPaymentHistory[^;]+;/g, 'const pendingDues = financeData?.pendingDues || 0;');
code = code.replace(/let totalAdvance = 0;[\s\S]+?\}\);\n  \}\);/g, 'const totalAdvance = financeData?.totalAdvance || 0;');
code = code.replace(/const filteredLogs = mockPaymentHistory\.filter/g, 'const filteredLogs = (financeData?.history || []).filter');
code = code.replace(/\{mockPaymentHistory\.length/g, '{(financeData?.history || []).length');

fs.writeFileSync('src/app/dashboard/finance/page.tsx', code);
