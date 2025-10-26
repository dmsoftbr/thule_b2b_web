export interface MobileCommunicationModel {
  id: string;
  title: string;
  message: string;
  contentUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  statusId: string;
  sentAt?: Date;
  sentBy?: string;
}
