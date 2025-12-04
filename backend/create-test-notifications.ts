import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestNotifications() {
  try {
    // Get first user
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('❌ No users found in database. Please create a user first.');
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.id} (${user.email})`);

    // Create test notifications
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: user.id,
          type: 'team',
          title: 'Team Invitation',
          message: 'You\'ve been invited to join the Bocce A Team!',
          read: false,
          actionUrl: '/teams/bocce-a',
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          type: 'match',
          title: 'Upcoming Match',
          message: 'Your Bocce match is scheduled for tomorrow at 2 PM',
          read: false,
          actionUrl: '/matches/upcoming',
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: 'You\'ve earned the "Rising Star" achievement',
          read: false,
          actionUrl: '/achievements',
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          type: 'alert',
          title: 'Request Pending',
          message: 'Your team captain transfer request is awaiting approval',
          read: true, // Mark as read
          actionUrl: '/notifications',
        },
      }),
    ]);

    console.log(`\n✓ Created ${notifications.length} test notifications:`);
    notifications.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n.title} (${n.read ? 'read' : 'unread'})`);
    });

    const unreadCount = notifications.filter(n => !n.read).length;
    console.log(`\n✓ Unread count: ${unreadCount}`);
    console.log(`\n✓ User ID for testing: ${user.id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating notifications:', error);
    process.exit(1);
  }
}

createTestNotifications();
