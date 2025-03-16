import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import validateRequest from '_middleware/validate-request';
import Role from '_helpers/role';
import userService from 'users/user.service';
import { first } from 'lodash';
import { isStrongPassword } from 'validator';

const router = express.Router();

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

// router functions

function getAll(req: Request, res: Response, next: NextFunction): void {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void  {
    userService.getById(req.params.id)
    .then(user => res.json(user))
    .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    userService.create(req.body)
    .then(() => res.json({ message: 'User created' }))
    .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    userService.update(req.params.id, req.body)
    .then(() => res.json({ message: 'User updated' }))
    .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    userService.delete(req.params.id)
    .then(() => res.json({ message: 'User deleted' }))
    .catch(next);
}

// schema functions 

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    });
    validateRequest(req, next, schema);
}