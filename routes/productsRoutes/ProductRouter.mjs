import express from "express";
import productModel from "../../dbRepo/Schemas/productsSchema.mjs";
const router = express.Router();
import admin from "firebase-admin";
import multer from "multer";
import fs from "fs";

const storageConfig = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});

let uploadMiddleware = multer({
  storage: storageConfig,

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      // this is requesting in uploadMiddleware body and you can send error
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
      //   return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

let serviceAccount = {
  type: "service_account",
  project_id: "air-sysborg-9e768",
  private_key_id: "407c630f0acda9224192b54d1748eefa8a409c77",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDO+OJ61vVldxfW\nV7GtxbtWNL6fV4Urs7tWKyt8e40LaVDtVEyQTaG18paKJaPZI0SzqNxka6jbTHsl\nMUk7m4/RI5y6IgV9cfkedgqmkVJQAA9BoDDg7QliXxo5cxdPcmj23svHutLQQAp8\nBOVHbXDovLvcmHssv1eTYGAXpG+0zzSNnLD8vP6m39KY8cuR39O+04VW4aN0XOoJ\n110nTM0E9doA9hFYcxIZ3eL62BHoUjMYC7Bhnms486qrprUzF9AFfdFvetnF3G5m\n0EK69rQBuX1SYHIRL4PPezjbxvLcwXvHmUTs0wpaypfaQmgVdNzjwEsUExHoBJ2m\nIfjD3d5FAgMBAAECggEAJDxq2nrcB+Gr6Lj9wKDHxbYCUb9u71HOUK3KNUckUIUl\nyAdkSDdvQn2wYYtpflCwbIv52hMHQy3GuaJBYhBAQ6tqeyQNtgLITM752mPC94Kr\nKSA0royRggmIe9pskFpFikNDhjptQkyUCVaKFdFRXU39zgdcOV9eo8zRxhHiBNOZ\ncK9PH5z9k0QVouu1BLUna/DZzeAlRzgfAmUIdScqP8MJ8sekJXC5UMpfDD5oxurY\nUx8diakm+vRCwp7MGmabIvm7PYE0gNpQuSV69ZY0ZBzQjUqRVSPd8ag97iqysh1Q\n9kletdC0nKPBcTJN2z1Gj4hVld4ZBx55QLDPAzSz2QKBgQD0C7bddUR/xbiQ87Mx\nkomg1FE/kSq/36Y/YmTmqm0hambpPBoYgKxP1u+m84KJFjIruw5fx2v3jbktYdqk\ngElsv6F47MIOqriGEFWP273ZnBe6oUT3tVzDMYlmT7vIVbXSqNhRWRLNaP3GdziM\n4GZIvD8G2Z8znUwFQL4hrAnOGwKBgQDZHEZ7sPeZVcKF5UrrM4qVPWlg+dWyjgiW\nsj6ufCsNIMySIOFZyKFCS2p3rOVrbfSsJ8RoAwt7Yt4VEyTv9p3ksBZ79UIY1lvI\n2KOSGFuR7Ds/XXWleH0kW/GQXNGg2T165npB0bW+Af1o/klJQb/Hlg9R7EflIvkz\nWC4qcqRLHwKBgQCmtc3gcHgvlIClPGS/y2uK2x75fpAmbIAjsnJdBDTya74LO8xT\nyqprC9fAQ357aRcyumByW0dM35qM/tieISiHSkziz1EtNcBBjKz2TdTd73xiOEJl\nuJW6nX9Pzc3oZ2yCkGbdAy0N9tfNGKofyjb1HusrIcRYPO6uc/CuDdjQ2wKBgGfa\nS6jdNQMG797GmLi7Vd4fmynFOECKCnezWaJzSNCl0NVRnxooi2K/2nTWooNp/HDh\nMOUkF7j0yRDBsJiMmmiLBqZS4kQpPYxsfInk1uCNZKXh2eXGJe5fgMSycaAEapFA\ncFjNrKbwIry3bmz5Y3hgQoHIiXeE7DlwQ90QK6C3AoGBAK1dQjsneL1QCO8JZk9I\ns3pNpQ4TZNJn8CusXJjrnQhx6TI9cZyMyEAnpfrxCfiVLfRgRaB3M7s6mS3KPswn\nQtiBLxij9fyDN7P72a63/pm/wy4roPMXkFj5BHedkJNRDEuYmIzOvYLnkjdIeLXE\n7sn8hoM+edtMZhkw8XkjWnoW\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-mmwx4@air-sysborg-9e768.iam.gserviceaccount.com",
  client_id: "104845424751652665713",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mmwx4%40air-sysborg-9e768.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://air-sysborg-9e768.firebaseio.com",
});
const bucket = admin.storage().bucket("gs://air-sysborg-9e768.appspot.com");

router.post("/api/v1/product", uploadMiddleware.any(), async (req, res) => {
  try {
    if (req.fileValidationError) {
      res
        .status(400)
        .send({ message: "Only .png, .jpg and .jpeg format allowed!" });
      return;
    }

    if (!req.files[0]) throw new Error("please upload product Image");

    if (req.files[0].size >= 1000000) throw new Error("only accept 1 Mb Image");
    bucket.upload(
      req.files[0].path,
      {
        destination: `SaylaniHacthon/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
      },
      function (err, file, apiResponse) {
        if (!err) {
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2999",
            })
            .then((urlData, err) => {
              if (!err) {
                fs.unlink(req.files[0].path, (err) => {
                  if (err) {
                    console.error(err, "dd");
                    return;
                  } else {
                    console.log("Delete sus");
                  }
                });

                productModel.create(
                  {
                    name: req.body.itemName,
                    description: req.body.desp,
                    price: req.body.price,
                    unit: req.body.unitName,
                    url: urlData[0],
                    category: req.body.category,
                  },
                  (err, saved) => {
                    if (!err) {
                      console.log("saved: ", saved);

                      res.send({
                        message: "Product added successfully",
                      });
                    } else {
                      console.log("err: ", err);
                      res.status(500).send({
                        message: "server error",
                      });
                    }
                  }
                );
              }
            });
        } else {
          console.log("err: ", err);
          res.status(500).send({ message: err });
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
    console.error(error.message);
  }
});

router.get("/api/v1/products", (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "got all products successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});

router.get("/api/v1/product/:id", (req, res) => {
  const id = req.params.id;

  productModel.findOne({ _id: id }, (err, data) => {
    if (!err) {
      if (data) {
        res.send({
          message: `get product by id: ${data._id} success`,
          data: data,
        });
      } else {
        res.status(404).send({
          message: "product not found",
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});

router.delete("/api/v1/product/:id", (req, res) => {
  const id = req.params.id;

  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    console.log("deleted: ", deletedData);
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product has been deleted successfully",
        });
      } else {
        res.status(404);
        res.send({
          message: "No Product found with this id: " + id,
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});

router.put("/api/v1/product/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  if (!body.name || !body.price || !body.description) {
    res.status(400).send(` required parameter missing. example request body:
          {
              "name": "value",
              "price": "value",
              "description": "value"
          }`);
    return;
  }

  try {
    let data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          description: body.description,
        },
        { new: true }
      )
      .exec();

    console.log("updated: ", data);

    res.send({
      message: "product modified successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }
});

export default router;
