import { Router } from "express";
const router = Router();
import { Usesignin, userSignup } from "../controller/user-controller";

router.route('/signup').post(userSignup);
router.route('/signin').post(Usesignin);


export default router;
