import { Body, Controller, Get, Param, Post } from '@nestjs/common';

type Notifications = {
  [key: string]: {
    [key: string]: any[];
  };
};
const notifications: Notifications = {};

@Controller()
export class SubscriberController {
  @Get()
  getAllNotifications() {
    return notifications;
  }

  @Get(':subscriber')
  getSubscriberNotifications(@Param() params: { subscriber: string }) {
    return notifications[params.subscriber] || [];
  }

  @Post(':subscriber')
  saveNotification(
    @Param() params: { subscriber: string },
    @Body() body: { topic: string; data: any },
  ) {
    const { subscriber } = params;
    console.log(`${subscriber}: ${JSON.stringify(body)}`);
    if (
      notifications[subscriber] &&
      Array.isArray(notifications[subscriber][body.topic])
    ) {
      const existingNotifications = notifications[subscriber][body.topic];
      notifications[subscriber][body.topic] = [
        body.data,
        ...existingNotifications,
      ];
    } else {
      notifications[subscriber] = {};
      notifications[subscriber][body.topic] = [body.data];
    }
    return notifications[subscriber];
  }
}
