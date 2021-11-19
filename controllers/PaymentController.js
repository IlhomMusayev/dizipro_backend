module.exports = class PaymentController {
	static async PaymentCreatePostController(req, res, next) {
		try {
			const project_id = req.params?.project_id;

			if (!project_id) throw new res.error(404, "Project not found");

			const project = await req.db.projects.findOne({
				where: {
					project_id,
				},
				include: [
					{
						model: req.db.users,
						as: "user",
					},
					{
						model: req.db.payments,
						as: "payments",
					},
				],
			});

			if (!project) throw new res.error(404, "Project not found");

			if (
				project.payments.find(
					(payment) => payment.dataValues.payment_status == "PAID"
				)
			)
				throw new res.error(400, "You have already paid ");

			res.json({
				ok: true,
			});
		} catch (error) {
			next(error);
		}
	}
};
