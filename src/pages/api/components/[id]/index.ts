import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { componentValidationSchema } from 'validationSchema/components';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.component
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getComponentById();
    case 'PUT':
      return updateComponentById();
    case 'DELETE':
      return deleteComponentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getComponentById() {
    const data = await prisma.component.findFirst(convertQueryToPrismaUtil(req.query, 'component'));
    return res.status(200).json(data);
  }

  async function updateComponentById() {
    await componentValidationSchema.validate(req.body);
    const data = await prisma.component.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteComponentById() {
    const data = await prisma.component.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
