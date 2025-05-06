import { Router } from "express";
import { CreateElement, createAvater, createMap, createSpace, createSpaceElement } from "../controller/admin-controller";
import { userMiddleware } from "../middleware/user-middleware";
const router = Router();

router.route("/space/create").post(userMiddleware ,createSpace);
router.route("/avatar/create").post(userMiddleware ,createAvater);
router.route("/space:spaceId/create").post(userMiddleware ,createSpaceElement);
router.route("/element/create").post(userMiddleware ,CreateElement);
router.route("/map/create").post(userMiddleware ,createMap);
router.route("/map/createMapElement").post(userMiddleware ,createMap);


export default router;