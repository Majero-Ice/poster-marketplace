export interface Purchase {
  id: string;
  posterId: string;
  customerEmail: string;
  stripeSessionId: string;
  downloadToken: string;
  downloadedAt: Date | null;
  createdAt: Date;
}
