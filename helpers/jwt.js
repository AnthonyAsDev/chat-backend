const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
	return new Promise((res, rej) => {
		const payload = {
			uid,
		};

		jwt.sign(
			payload,
			process.env.JWT_KEY,
			{
				expiresIn: "24h",
			},
			(err, token) => {
				if (err) {
					rej("No se pudo generar el JWT");
				} else {
					res(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};
