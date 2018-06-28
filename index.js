// 标识符类型
const Op = Symbol('Op')
const Num = Symbol('Num');
const Identifier = Symbol('Identifier');
const Assignment = Symbol('Assignment')
const TensorArray = Symbol('TensorArray')

//状态转移
const AssignmentState = Symbol('AssignState')
const StartState = Symbol('StartState')
const IdentifierState = Symbol('IdentifierState')
const OpState = Symbol('OpState')
const EndState = Symbol('EndState')

// 作用域
const scope = {};

const isNum = (str) => {
	return /^[\d]+$/.test(str);
}

const isIdentifier = (str) => {
	return /^[A-Za-z_]+\w?$/.test(str);
}

const isOp = (str) => {
	return /^[\*|\-|\+|\.]$/.test(str);
}

const isAssignment = (str) => {
	return str == '=';
}

const isTensorArray = (str) => {
	return /^\[+[\[|\]|\d|\,]+\]+$/.test(str);
}

const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);

const tokenizer = (token) => {
	return token.map(s => {
		if(isNum(s)) {
			return {
				val:s,
				type:Num
			}
		} else if(isIdentifier(s)) {
			return {
				val:s,
				type:Identifier
			}
		} else if(isOp(s)) {
			return {
				val:s,
				type:Op
			}
		} else if (isAssignment(s)) {
			return {
				val:s,
				type: Assignment
			}
		} else if (isTensorArray(s)) {
			return {
				val:s,
				type: TensorArray
			}
		} else if (isTensorArray(s)) {
			return {
				val:s,
				type: TensorArray
			}
		} else {
			throw Error("未知表示符号" + s);
		}
	})
}

const addArray = (arr1,arr2) => {

}
const dotArray = (arr1,arr2) => {

}
const subArray = (arr1,arr2) => {
	
}
const mulArray = (arr1,arr2) => {
	
}

const calArray = (strObj) => {
	const arr = [];
	let num_str = '';
	while(strObj.str.length>strObj.i) {
		if (strObj.str[strObj.i] == '[') {
			strObj.i++;
			arr.push(calArray(strObj));
		} else if (strObj.str[strObj.i] == ']' ) {
			strObj.i++;
			if (num_str) {
				arr.push(parseInt(num_str));
			}
			num_str = '';
			return arr;
		} else if (isNum(strObj.str[strObj.i])) {
			num_str += strObj.str[strObj.i++]
		} else if (strObj.str[strObj.i] == ',') {
			strObj.i++;
			if (num_str) {
				arr.push(parseInt(num_str));
			}
			num_str = '';
		} else {
			throw Error("未知表示符号" + strObj.str);
		}
	}
	return arr;
}
const calVal = (node) => {
	if (node.type == Num) {
		return parseInt(node.val)
	} else if (node.type == TensorArray) {
		return calArray({str:node.val,i:1})
	}
}
const calmulate = (root) => {
	if (root.type == Identifier && root.body.type == Assignment) {
		return scope[root.val] = calmulate(root.body.body);
	} else if (root.type == Op) {
		if (root.val == '*') {
			return  mulArray(calVal(root.left),calVal(root.right))
		} else if (root.val == '+') {
			return  addArray(calVal(root.left),calVal(root.right))
		} else if (root.val == '-') {
			return  subArray(calVal(root.left),calVal(root.right))
		} else if (root.val == '.') {
			return  dotArray(calVal(root.left),calVal(root.right))
		}
		
	}
}

const main = (str) => {
	const token = tokenizer(lex(str));
	let i = 0;
	let state = StartState;
	const root = {};
	let node;
	while (token.length > i && state != EndState) {
		if (token[i].type == Identifier && state == StartState) {
			state = IdentifierState;
			root.type = Identifier;
			root.val = token[i].val;
			root.body = {};
			node = root.body;
			i++;
		} else if (token[i].type == Assignment && state == IdentifierState) {
			state = AssignmentState;
			node.type = Assignment;
			node.body = {};
			node = node.body;
			i++;
		} else if (state == AssignmentState) {
			if (token.length > i+2 && token[i+1].type == Op) {
				node.type = Op;
				node.val = token[i+1].val;
				node.left = {
					type:token[i].type,
					val: token[i].val
				}
				// 应该递归建树，这里偷懒
				node.right = {
					type:token[i+2].type,
					val: token[i+2].val
				}
				i = i+2;
				state = EndState;
			} else {
				node.type = token[i].type;
				node.val = token[i].val;
				i++;
			}
		}
	}
	console.log(root);
	console.log(calmulate(root));
	

}

main("x = [1,2,3] * [2,1,2]")                                                                                                                        
// console.log(calArray({str:"[[1,21]]",i:1}));


