// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient
const axios = require('axios')

const normPostions = [
	{name: 'US Senate', id: 2, include: true},
	{name: 'US House Of Representatives', id: 3, include: true},
	{name: 'State Legislative Upper House', id: 4, include: true},
	{name: 'State Legislative Lower House', id: 5, include: true},
	{name: 'Governor', id: 100, include: true},
	{name: 'Lieutenant Governor', id: 110, include: true},
	{name: 'Secretary of State', id: 130, include: true},
	{name: 'State Attorney General', id: 140, include: true},
	{name: 'State Public Defender', id: 145, include: true},
	{name: 'State Senate', id: 600, include: true},
	{name: 'State House of Representatives', id: 610, include: true},
	{name: 'District Attorney', id: 750, include: true},
	{name: 'District Public Defender', id: 755, include: true},
	{name: 'County Legislative', id: 912, include: true},
	{name: 'County Township Supervisor', id: 912, include: true},
	{name: 'County Executive Board', id: 912, include: true},
	{name: 'County Clerk', id: 944, include: true},
	{name: 'County District Court Clerk', id: 944, include: true},
	{name: 'County Chancery Court Clerk', id: 955, include: true},
	{name: 'County Court Clerk', id: 956, include: true},
	{name: 'County Comptroller', id: 956, include: true},
	{name: 'County Chancery', id: 958, include: true},
	{name: 'County Circuit Court Clerk', id: 958, include: true},
	{name: 'County Superior Court Clerk', id: 959, include: true},
	{name: 'County Criminal Court Clerk', id: 961, include: true},
	{name: 'County Juvenile Court Clerk', id: 962, include: true},
	{name: 'County Civil Court Clerk', id: 966, include: true},
	{name: 'County Solicitor General', id: 972, include: true},
	{name: 'County Attorney', id: 975, include: true},
	{name: 'County Sheriff', id: 980, include: true},
	{name: 'County Tax Assessor', id: 981, include: true},
	{name: 'County Tax Collector', id: 981, include: true},
	{name: 'County Deputy Sheriff', id: 982, include: true},
	{name: 'County Marshal', id: 985, include: true},
	{name: 'County Constable', id: 1030, include: true},
	{name: 'County Jailer', id: 1140, include: true},
	{name: 'County Prothonotary', id: 1145, include: true},
	{name: 'County Court of Common Pleas Clerk', id: 1145, include: true},
	{name: 'County Clerk of Courts', id: 1145, include: true},
	{name: 'County Public Defender', id: 1160, include: true},
	{name: 'County (High) Bailiff', id: 1230, include: true},
	{name: 'County Public Saftey Board', id: 1324, include: true},
	{name: 'Justice of the Peace (Nonjudicial)', id: 1360, include: true},
	{name: 'City Executive', id: 1500, include: true},
	{name: 'City Mayor ', id: 1500, include: true},
	{name: 'City Legislative Chair', id: 1510, include: true},
	{name: 'City President of Council', id: 1510, include: true},
	{name: 'City Legislative', id: 1520, include: true},
	{name: 'City Supervisor', id: 1530, include: true},
	{name: 'City Police Chief', id: 1610, include: true},
	{name: 'City Marshal', id: 1610, include: true},
	{name: 'City Fire Commission', id: 1611, include: true},
	{name: 'City Police Commission', id: 1615, include: true},
	{name: 'City Constable', id: 1620, include: true},
	{name: 'City Constable', id: 1625, include: true},
	{name: 'City Trustee', id: 1625, include: true},
	{name: 'City Attorney', id: 1635, include: true},
	{name: 'City Prosecutor', id: 1637, include: true},
	{name: 'City Public Advocate', id: 1685, include: true},
	{name: 'City Mayoral Advisor', id: 1695, include: true},
	{name: 'City Warden', id: 1940, include: true},
	{name: 'City Public Safety Board', id: 1960, include: true},
	{name: 'Township Mayor', id: 2000, include: true},
	{name: 'Township Constable', id: 2090, include: true},
	{name: 'Township Director of Law', id: 2110, include: true},
	{name: 'Township Police Commission', id: 2183, include: true},
	{name: 'Police District', id: 2324, include: true},
	{name: 'Fire/Police (Joint)', id: 2325, include: true},
	{name: 'Police/Sewer/Fire District (Joint)', id: 2508, include: true},
	{name: 'Judicial Supreme Court - Chief Justice', id: 3990, include: true},
	{name: 'Judicial Supreme Court', id: 4000, include: true},
	{name: 'Judicial Appellate Court - Chief Justice', id: 4005, include: true},
	{name: 'Judicial Appellate Court', id: 4010, include: true},
	{name: 'Judicial Criminal Appellate Court', id: 4020, include: true},
	{name: 'Judicial Commonwealth Court', id: 4022, include: true},
	{name: 'Judicial Trial Court - General', id: 4027, include: true},
	{name: 'Judicial Trial Court - Criminal', id: 4029, include: true},
	{name: 'Judicial Circuit Court (1)', id: 4030, include: true},
	{name: 'Judicial Trial Court - Drug', id: 4031, include: true},
	{name: 'Judicial Trial Court Associate', id: 4032, include: true},
	{name: 'Judical Trial Court - Probate', id: 4033, include: true},
	{name: 'Judical Trial Court - Juvenile', id: 4034, include: true},
	{name: 'Judical Trial Court - Domestic//Family', id: 4035, include: true},
	{name: 'Judical Trial Court - Chancery', id: 4036, include: true},
	{
		name: 'Judicial Trial Court - Juvenile/Probate (Joint)',
		id: 4037,
		include: true
	},
	{
		name: 'Judicial Trial Court - Juvenile/Domestic (Joint)',
		id: 4038,
		include: true
	},
	{
		name: 'Judicial Trial Court - Juvenile/Probate/Domestic (Joint)',
		id: 4039,
		include: true
	},
	{
		name: 'Judicial Trial Court - General/Domestic (Joint)',
		id: 4040,
		include: true
	},
	{name: 'Judicial Trial Court (Inferior)', id: 4050, include: true},
	{name: 'Judicial Supreme Court - Retention', id: 4051, include: true},
	{name: 'Judicial Appellate Court - Retention', id: 4052, include: true},
	{name: 'Judicial Commonwealth Court - Retention', id: 4053, include: true},
	{name: 'Judicial Trial Court - Retention', id: 4054, include: true},
	{name: 'Judicial Trial Court Subcircuit', id: 4060, include: true},
	{name: 'Judicial County Court', id: 4470, include: true},
	{name: 'Judicial County Court - Chief Magistrate', id: 4471, include: true},
	{name: 'Judicial County Court - Magistrate', id: 4472, include: true},
	{
		name: 'Judicial County Court - Probate/Magistrate (Joint)',
		id: 4476,
		include: true
	},
	{name: 'Judicial County Court - Civil', id: 4478, include: false},
	{name: 'Judicial County Court - Criminal', id: 4479, include: true},
	{name: 'Judicial County Court - Family', id: 4480, include: true},
	{name: 'Judicial County Court - Juvenile', id: 4481, include: true},
	{name: 'Judicial County Court - Traffic', id: 4482, include: false},
	{name: 'Justice of the Peace (Judicial)', id: 4490, include: true},
	{name: 'Judicial Local Court', id: 4500, include: true},
	{name: 'Judicial Local Court Associate Judge', id: 4501, include: true},
	{name: 'Judicial Local Court - Small Claims', id: 4520, include: true},
	{name: 'Judicial Local Court - Traffic', id: 4530, include: false},
	{name: 'Judicial Local Court - Housing', id: 4535, include: true}
]

const normPositionsRegExp = normPostions.filter(d => d.include).map(d => d.id)

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
		return Promise.all(
			allPositions.positions.map(pos =>
				resolveProperty(
					{
						position_id: pos.position_id,
						position_name: pos.name,
						normalized_position_name: pos.normalized_position.name,
						normalized_position_id: pos.normalized_position.id,
						tagged: normPositionsRegExp.test(pos.normalized_position.id),
						level: pos.normalized_position.level,
						description: pos.description,
						state: pos.state,
						tier: pos.tier
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
								party: cand.party_name,
								incumbent: cand.incumbent,
								updated_at: cand.updated_at,
								type: cand.candidate_type,
								links: cand.urls,
								photo: res.data.photo_url,
								endorsements: res.data.endorsements,
								candidacies: res.data.candidacies,
								experience: res.data.experience,
								education: res.data.education,
								issues: res.data.issues
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
			normPositionIDs: normPostions,
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
