import { Router } from "express";
const router = Router();
import { Usesignin, getSpaceById, userSignup } from "../controller/user-controller";

router.route('/signup').post(userSignup);
router.route('/signin').post(Usesignin);
router.route('/space/:id').get(getSpaceById);


export default router;
