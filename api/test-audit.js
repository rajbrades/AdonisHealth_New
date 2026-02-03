const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    console.log('\n=== AUDIT LOGS ===\n');
    if (logs.length === 0) {
      console.log('No audit logs found.');
    } else {
      logs.forEach((log, index) => {
        console.log(`${index + 1}. Action: ${log.action}`);
        console.log(`   User: ${log.user?.email || 'Unknown'} (${log.user?.role || 'N/A'})`);
        console.log(`   Resource: ${log.resource}`);
        console.log(`   IP Address: ${log.ipAddress || 'N/A'}`);
        console.log(`   Timestamp: ${log.timestamp}`);
        if (log.metadata) {
          console.log(`   Metadata: ${log.metadata}`);
        }
        console.log('');
      });
    }

    // Count by action type
    const actionCounts = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: true,
    });

    console.log('=== AUDIT LOG SUMMARY ===\n');
    actionCounts.forEach(({ action, _count }) => {
      console.log(`${action}: ${_count} events`);
    });

  } catch (error) {
    console.error('Error querying audit logs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuditLogs();
