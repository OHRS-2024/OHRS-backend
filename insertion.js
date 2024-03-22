const crypto = require('crypto');
const bcrypt = require('bcrypt');

let allUserIds = [];
let allpasswords = [];
const userRole = [1000, 2000, 3000];

const generateString = (len) =>{
	const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	let name = '';
	for (let x = 0; x < len; x++) {
		name += letters[crypto.randomInt(26)];
	}
	return name;
}

const generateHash = async (str) =>{
	const hashed = await bcrypt.hash(str, 8);
	return hashed;
}

const generatePhone = () =>{
	let phone = '';
	for (let x = 0; x < 8; x++) {
		phone += crypto.randomInt(9);
	}
	return phone;
}

async function users() {
	let gender = "male";
	let userID = "";
	console.log('INSERT INTO users(user_id,full_name, gender,phone_number,email, date_joined)VALUES');
	for(let x = 0; x < 20; x++){
		userID = crypto.randomUUID();
		console.log(`('${userID}','${generateString(5)} ${generateString(5)}','${gender}','+2519${generatePhone()}','${generateString(7)}@gmail.com','${new Date().toLocaleString()}'),`);
		allUserIds.push(userID);
		gender = gender === "female" ? "male" : "female";
	}
}


async function accounts() {
	let userID = '';
	let password = '';
	let hashedPassword = '';

	console.log('INSERT INTO user_auth(user_id,auth_string,user_role)VALUES');

	for(let x = 0; x < 20; x++){
		userID = allUserIds[x];
		password = generateString(8);
		hashedPassword = await generateHash(password);
		const userRole = x%10 === 0 ? 3000 : 1000;
		console.log(`('${userID}','${hashedPassword}',${userRole}),`);
		allpasswords.push(password);
	}
	console.log(allpasswords);
}

users();
accounts();