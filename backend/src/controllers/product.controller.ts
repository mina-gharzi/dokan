import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { productService } from "../services/product.service";

const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getAllProducts({
    search: req.query.search as string | undefined,
    categoryId: req.query.category as string | undefined,
    sort: req.query.sort as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined,
  });
  res.status(200).json({ success: true, ...result });
});

const getOne = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: product });
});

const getBySlug = asyncHandler(async (req: Request<{ slug: string }>, res: Response) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.status(200).json({ success: true, data: product });
});

const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body, req.user!.userId);
  res.status(201).json({ success: true, data: product });
});

const update = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user!);
  res.status(200).json({ success: true, data: product });
});

const remove = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await productService.deleteProduct(req.params.id, req.user!);
  res.status(204).send();
});

export const productController = { getAll, getOne, getBySlug, create, update, remove };