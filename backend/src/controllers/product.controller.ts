import { Request, Response } from "express";
import { productService, AppError } from "../services/product.service";

interface ProductIdParams {
  id: string;
}

async function getAll(req: Request, res: Response) {
  const products = await productService.getAllProducts();
  res.status(200).json({ success: true, data: products });
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

export const productController = {
  getAll,
  getOne,
  create,
  update,
  remove,
};