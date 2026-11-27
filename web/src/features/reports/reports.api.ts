import type { ReportInput } from '@selit/shared';

import { getApi } from '@/lib/api';

export function submitReport(input: ReportInput) {
  return getApi().reports.submit(input);
}
