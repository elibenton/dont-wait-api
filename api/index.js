// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient
const axios = require('axios')

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB, taking a single parameter of the connection string
async function connectToDatabase(uri) {
	// If the database connection is cached,
	// use it instead of creating a new connection
	if (cachedDb) {
		return cachedDb
	}

	// If no connection is cached, create a new one
	const client = await MongoClient.connect(uri, {useUnifiedTopology: true})

	// Select the database through the connection,
	// using the database path of the connection string
	const db = await client.db(url.parse(uri).pathname.substr(1))

	// Cache the database connection and return the connection
	cachedDb = db
	return db
}

// 61.190363, -149.819110
async function callPositions(lat, lon, address, county) {
	try {
		const {data} = await axios({
			method: 'get',
			baseURL: 'https://api.civicengine.com',
			url: '/positions',
			params: {
				lat: lat, // only match on latitude if it is provided
				lon: lon, // only match on longitude if it is provided
				address: address, // only match on address if it is provided
				county: county, // only match on county if it is provided
				include_candidates: 1, // include candidates (1 = "yes")
				include_office_holders: 1, // include office_holders (1 = "yes")
				include_endorsements: 1, // include endorsements (1 = "yes")
				include_volunteer_urls: 1, // not sure what this means...
				election_date: '2020-11-03' // only show results for the November 2020 general
			},
			headers: {
				'x-api-key': process.env.BR_KEY_KATHERINE
			}
		})

		return data
	} catch (error) {
		console.log('Failed at callPositions!', error)
	}
}

function resolveProperty(obj, name, promiseValue) {
	return promiseValue.then(value => {
		obj[name] = value
		return obj
	})
}

function filterCriminalJustice(allPositions) {
	// Tag the response on whether they are related to criminal justice
	try {
		const criminalJusticePositions = new RegExp(
			'1635|1620|1625|1500|1520|1510|1695|1610|1611|1615|1637|1685|1960|1530|1940|1230|975|955|958|966|944|1030|956|961|982|1140|962|912|985|1145|1146|1160|1324|980|981|972|959|750|755|2325|100|4036|4035|4034|4033|4010|4005|4052|4030|4022|4053|4470|4471|4479|4480|4481|4472|4476|4020|4500|4535|4520|4501|4000|3990|4051|4029|4031|4027|4040|4038|4037|4039|4054|4050|4032|4060|4490|1360|2324|2508|140|145|2090|2110|2000|2183'
		)

		return Promise.all(
			allPositions.positions.map(pos =>
				resolveProperty(
					{
						position_id: pos.position_id,
						position_name: pos.name,
						normalized_position_name: pos.normalized_position.name.replace(
							/(\w+)[\/\/|\/](\w+)/,
							'$1'
						),
						tagged: criminalJusticePositions.test(
							pos.normalized_position.id
						),
						level: pos.normalized_position.level,
						description: pos.description,
						state: pos.state,
						tier: pos.tier,
						candidates_meta: pos.candidates.map(cand => ({
							party: cand.party_name
						}))
					},
					'candidates',
					Promise.all(
						pos.candidates.map(cand =>
							axios({
								method: 'get',
								baseURL: 'https://api.civicengine.com',
								url: `/candidate/${cand.id}`,
								params: {election_id: cand.election_id},
								headers: {
									'x-api-key': process.env.BR_KEY_KATHERINE
								}
							}).then(res => ({
								name: `${res.data.first_name} ${res.data.last_name}`,
								photo: res.data.photo_url,
								endorsements: res.data.endorsements,
								candidacies: res.data.candidacies,
								experience: res.data.experience,
								education: res.data.education,
								issues: res.data.issues,
								links: res.data.url
							}))
						)
					)
				)
			)
		)
	} catch (error) {
		console.log('Failed at filterCriminalJustice', error)
	}
}

// The main, exported, function of the endpoint, dealing with the request and subsequent response
const handler = async (req, res) => {
	const {lat, lon, address, zipcode} = req.query

	const allPositions = await callPositions(lat, lon, address, zipcode)
	const filteredPositions = await filterCriminalJustice(allPositions)

	// Get a database connection, cached or otherwise, using the connection string environment variable as the argument
	// const db = await connectToDatabase(process.env.MONGODB_URI)
	// Select the "users" collection from the database
	// const collection = await db.collection('candidates')
	// const users = await collection.find({}).toArray()

	// Respond with a JSON string of all users in the collection
	try {
		res.status(200).json({
			status: 'Success!',
			timestamp: Date(allPositions.timestamp),
			lat: lat,
			lon: lon,
			result_count: allPositions.result_count,
			data: filteredPositions // change to most up to date array
		})
		console.log('Success!')
	} catch (error) {
		res.status(400).json({success: false})
		console.log('Failed at Main!', error)
	}
}

const allowCors = fn => async (req, res) => {
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,OPTIONS,PATCH,DELETE,POST,PUT'
	)
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	)
	if (req.method === 'OPTIONS') {
		res.status(200).end()
		return
	}
	return await fn(req, res)
}

module.exports = allowCors(handler)
