const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // Test if new models exist by querying them
    const admins = await prisma.associationAdmin.findMany({ take: 1 });
    const requests = await prisma.captainRequest.findMany({ take: 1 });
    const invites = await prisma.captainInvitation.findMany({ take: 1 });
    const rules = await prisma.leagueRules.findMany({ take: 1 });
    
    console.log('✅ AssociationAdmin table exists');
    console.log('✅ CaptainRequest table exists');
    console.log('✅ CaptainInvitation table exists');
    console.log('✅ LeagueRules table exists');
    console.log('\n✅ All new association admin tables created successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
