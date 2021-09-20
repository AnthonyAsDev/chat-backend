const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existeEmail = await Usuario.findOne({ email });

		if (existeEmail) {
			return res.status(400).json({
				ok: false,
				msg: "El correo ya esta registrado",
			});
		}

		const usuario = new Usuario(req.body);

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		// Generate JWT
		const token = await generarJWT(usuario.id);

		return res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const usuarioDB = await Usuario.findOne({ email });
		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: "Email no encontrado",
			});
		}

		const validPassword = bcrypt.compareSync(password, usuarioDB.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "La contraseña no es valida",
			});
		}

		// generar el jwt
		const token = await generarJWT(usuarioDB.id);

		return res.json({
			ok: true,
			usuario: usuarioDB,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};
const renewToken = async (req, res) => {
	try {
		const uid = req.uid;
		const usuario = await Usuario.findById(uid);

		const token = await generarJWT(usuario.id);

		return res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		return res.status(404).json({
			ok: false,
		});
	}
};

module.exports = {
	crearUsuario,
	login,
	renewToken,
};
