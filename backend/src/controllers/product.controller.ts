import { Request, Response } from "express";
import { productService, AppError } from "../services/product.service";

interface ProductIdParams {
  id: string;
}

function getAll(req: Request, res: Response) {
  const products = productService.getAllProducts();
  res.status(200).json({ success: true, data: products });
}

function getOne(req: Request<ProductIdParams>, res: Response) {
  try {
    const product = productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

function create(req: Request, res: Response) {
  try {
    const product = productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

function update(req: Request<ProductIdParams>, res: Response) {
  try {
    const product = productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    handleError(err, res);
  }
}

function remove(req: Request<ProductIdParams>, res: Response) {
  try {
    productService.deleteProduct(req.params.id);
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