// src/types/fastify-multipart.d.ts
import { Multipart, MultipartFile } from '@fastify/multipart';

declare module 'fastify' {
  interface FastifyRequest {
    parts: () => AsyncIterableIterator<Multipart | MultipartFile>;
  }
}
