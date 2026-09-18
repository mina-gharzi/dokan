import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { productService, AppError } from "../services/product.service";

interface ProductIdParams extends ParamsDictionary {
  id: string;
}

async function getAll(req: Request, res: Response) {
  const result = await productService.getAllProducts({
    search: req.query.search as string | undefined,
    categoryId: req.query.category as string | undefined,
    sort: req.query.sort as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined,
  });

  res.status(200).json({ success: true, ...result });
}

async function getOne(req: Request<ProductIdParams>, res: Response) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

async function create(req: Request, res: Response) {
  try {
    const product = await productService.createProduct(req.body, req.user!.userId);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

async function update(req: Request<ProductIdParams>, res: Response) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user!);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

async function remove(req: Request<ProductIdParams>, res: Response) {
  try {
    await productService.deleteProduct(req.params.id, req.user!);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}

async function getBySlug(req: Request<{ slug: string }>, res: Response) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

export const productController = {
  getAll,
  getOne,
  getBySlug,
  create,
  update,
  remove,
};