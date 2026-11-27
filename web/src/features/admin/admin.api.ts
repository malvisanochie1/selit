import type {
  AccountStatus,
  ApartmentStatus,
  CategoryStat,
  ModeratedListingStatus,
  Report,
  ReportStatus,
  ReportTarget,
  UserRole,
} from '@selit/shared';

import { getApi } from '@/lib/api';

export function getAdminStats() {
  return getApi().admin.stats();
}

export function listAdminListings(status: ModeratedListingStatus | 'all', page: number) {
  return getApi().admin.listings(status, page);
}

export function setListingStatus(id: string, status: ModeratedListingStatus, reason?: string) {
  return getApi().admin.setListingStatus(id, status, reason);
}

export function listAdminApartments(status: ApartmentStatus | 'all', page: number) {
  return getApi().admin.apartments(status, page);
}

export function setApartmentStatus(id: string, status: ApartmentStatus, confirmed?: boolean) {
  return getApi().admin.setApartmentStatus(id, status, confirmed);
}

export function listAdminUsers(filters: {
  role?: UserRole;
  status?: AccountStatus;
  search?: string;
  page: number;
}) {
  return getApi().admin.users(filters);
}

export function setUserStatus(id: string, status: AccountStatus) {
  return getApi().admin.setUserStatus(id, status);
}

export function getCategoryStats() {
  return getApi().admin.categoryStats();
}

export function setCategoryStatus(slug: string, status: CategoryStat['status']) {
  return getApi().admin.setCategoryStatus(slug, status);
}

export function listReports(filters: {
  target: ReportTarget;
  status?: ReportStatus;
  page: number;
}) {
  return getApi().admin.reports(filters);
}

export function setReportStatus(report: Report, status: ReportStatus) {
  return getApi().admin.setReportStatus(report, status);
}

export function listVerifications(page: number) {
  return getApi().admin.verifications(page);
}

export function decideVerification(id: string, decision: 'verified' | 'rejected', note: string) {
  return getApi().admin.decideVerification(id, decision, note);
}
