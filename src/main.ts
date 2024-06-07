import Fastify from 'fastify';
const fastify = Fastify();

// Declare a route
fastify.get('/', async (_request, _reply) => ({ hello: 'world' }));

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  throw new Error;
}
