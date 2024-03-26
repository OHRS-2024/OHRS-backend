const crypto = require('crypto');
const bcrypt = require('bcrypt');
const getDate = require('./utils/date');

let allUserIds = [];
let allpasswords = [];
let allRoles = [];
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

function users() {
	let gender = "male";
	let userID = "";
	console.log('INSERT INTO users(user_id,full_name, gender,phone_number,email, date_joined)VALUES');
	for(let x = 0; x < 50; x++){
		userID = crypto.randomUUID();
		console.log(`('${userID}','${generateString(5)} ${generateString(5)}','${gender}','+2519${generatePhone()}','${generateString(10)}@gmail.com','${getDate()}'),`);
		allUserIds.push(userID);
		gender = gender === "female" ? "male" : "female";
	}
}

async function accounts() {
	let userID = '';
	let password = '';
	let hashedPassword = '';

	console.log('\n\nINSERT INTO user_auth(user_id,auth_string,user_role)VALUES');

	for(let x = 0; x < 50; x++){
		userID = allUserIds[x];
		password = generateString(8);
		hashedPassword = await generateHash(password);
		let userRole = 1000;
		if (x%5 === 0) {
			userRole = 3000;
		} else if (x%2 === 0) {
			userRole = 2000;
		}

		console.log(`('${userID}','${hashedPassword}',${userRole}),`);
		allpasswords.push(password);
		allRoles.push(userRole);
	}
	console.log(allpasswords);
}

function landlords (){
	let landlordId = "";
	const citizen = "Ethiopian";
	const region = "Addis Ababa";
	let woreda = "woreda 1";
	let idNo = 3093627034;
	const idType = "NATIONAL ID"
	let zone = "Kolfe keranio";

	console.log('\n\nINSERT INTO landlord(landlord_id,citizenship,region,zone,woreda,identification_number,identification_type)VALUES');
	for (let u = 0; u < allUserIds.length; u++) {
		
		landlordId = allUserIds[u];
		idNo = "AA" + generatePhone();
		if(u%10 === 0){ woreda = "woreda 10";
		}else if(u%8 === 0){ woreda = "woreda 8";
		}else if(u%7 === 0){ woreda = "woreda 7";
		}else if(u%5 === 0){ woreda = "woreda 5";
		}else if(u%3 === 0){ woreda = "woreda 3";
		}else if (u%2 === 0) { woreda = "woreda 2";
		}else { woreda = "woreda 1"; }

			if(u%12 === 0){  zone =   "Kolfe Keranio";
		}else if(u%9 === 0){ zone =   "Bole";
		}else if(u%8 === 0){ zone =   "Akaki kaliti";
		}else if(u%7 === 0){ zone =   "Lemi kura";
		}else if(u%5 === 0){ zone =   "Arada";
		}else if (u%2 === 0) { zone = "Addis Ketema";
		}else { zone = "Yeka"; }

		if (allRoles[u] === 2000) {
			console.log(`('${landlordId}','${citizen}','${region}','${zone}','${woreda}','${idNo}','${idType}'),`);
		}
		
	}
	
}

async function main() {
	users();
	await accounts();
	landlords();
}

main();
	