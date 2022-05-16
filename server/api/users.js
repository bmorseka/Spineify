const router = require('express').Router()
const {
	models: { User, Posture, PetPlant },
} = require('../db')
const Stretch = require('../db/models/Stretch')
const UserStretch = require('../db/models/UserStretch')
module.exports = router

router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll({
			// explicitly select only the id and username fields - even though
			// users' passwords are encrypted, it won't help if we just
			// send everything to anyone who asks!
			attributes: ['id', 'username'],
		})
		res.json(users)
	} catch (err) {
		next(err)
	}
})

//GET /users/poses (get all)
router.get('/poses', async (req, res, next) => {
	try {
		//token check, in axios, set authorization header
		const user = await User.findByToken(req.headers.authorization)
		const poses = await Posture.findAll({ where: { userId: user.id } })
		res.send(poses)
	} catch (error) {
		next(error)
	}
})

//POST /users/pose (add pose)
router.post('/pose', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization)
		const { data, type } = req.body
		const pose = Posture.create({ data, type, userId: user.id })
		res.send(pose)
	} catch (error) {
		next(error)
	}
})

//GET /users/plant (get single plant)
router.get('/plant', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization)
		const petPlant = await PetPlant.findOne({ where: { userId: user.id } })
		console.log('Plant in route', petPlant)
		res.send(petPlant)
	} catch (error) {
		next(error)
	}
})

router.get('/:id/favorites', async (req, res, next) => {
	try {
		const favorites = await UserStretch.findAll({
			where: {
				userId: req.params.id,
			},
			include: {
				model: Stretch,
			},
		})
		res.send(favorites)
	} catch (err) {
		next(err)
	}
})

router.put('/plant', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization)
		let petPlant = await PetPlant.findOne({ where: { userId: user.id } })
		let { level, points, inventory } = petPlant

		//define point system for each reward
		const pointSystem = { fertilizer: 3, nutritiousWater: 2, water: 1 }

		//determine ingredient given to tree
		const { item } = req.body

		//update instance (inventory, points, level)
		points = points + pointSystem[item]
		if (points >= 12) {
			level++
			points = points - 12
		}
		inventory = { ...inventory, [item]: inventory[item] - 1 }

		//update petPlant with new attribute values
		// petPlant = { ...petPlant, level, points, inventory }
		res.send(
			await petPlant.update({
				level,
				points,
				inventory,
				lastPointIncrease: new Date(),
			})
		)
	} catch (error) {
		console.log(error)
		next(error)
	}
})
