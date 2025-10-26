import type { MobileNotificationDeliveryModel } from "./notification-delivery.model";

export type MobileNotificationModel = {
  id: string;
  userId: string;
  createdAt: Date;
  title: string;
  message: string;
  sentAt: Date;
  sentBy: string;
  statusId: string;
  imageUrl: string;
  delivery?: MobileNotificationDeliveryModel[];
};
