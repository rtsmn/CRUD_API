import bcrypt from 'bcryptjs';
import { User } from '_helpers/db';

export default {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(): Promise<User[]> {
    return await User.findAll();
}

async function getById(id: number): Promise<User> {
    return await getUser(id);
}

async function create(params: { email: string; password: string; username?: string }): Promise<void> {
    if (await User.findOne({ where: { email: params.email } })) {
        throw `Email "${params.email}" is already registered`;
    }

    const user = new User(params);

    user.passwordHash = await bcrypt.hash(params.password, 10);

    await user.save();
}

async function update(id: number, params: { username?: string; password?: string }): Promise<void> {
    const user = await getUser(id);

    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await User.findOne({ where: { username: params.username } })) {
        throw `Username "${params.username}" is already taken`;
    }

    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, params);
    await user.save();
}

async function _delete(id: number): Promise<void> {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) throw 'User not Found';
    return user;
}