import { ControllerType, DescriptionsType, UrlData } from '../../lib/SQueryClient';

const post = {} as Partial<PostInterface>;
const survey = {} as Partial<SurveyInterface>;
const newPostData = {
	...post,
	message: {
		text: '' as string | undefined,
	} as MessageInterface,
	survey: {
		...survey,
		options: [] as LabelInterface[],
	},
};
const send = {
	like: true as boolean | undefined,
	newPostData: {} as Partial<typeof newPostData> | undefined,
	accountShared: '' as string | undefined,
	postId: '' as string | undefined,
};
export const Controller = {
	post: {
		// allUserPost:{
		//   send:{},
		//   receive:ArrayDataInit
		// },
		survey: {
			receive: {
				newLabel: '',
				lastLabel: '',
				totalVotes: 0,
				delay: 0,
				limiteDate: 0,
			},
			send: { postId: '', labelId: '' },
		},
		statPost: {
			send: {} as Partial<typeof send> & { postId: string },
			receive: {
				newCommentId: '',
				likes: 0,
				comments: 0,
				shares: 0,
				totalCommentsCount: 0,
				isLiked: false,
			},
		},
	},
	messenger: {
		createDiscussion: {
			send: {
				receiverAccountId: '',
			},
			receive: {
				id: '',
				modelPath: '',
			},
		},
		removeDiscussion: {
			send: {
				discussionId: '',
			},
			receive: 0,
		},
	},
	login: {
		user: {
			send: {
				email: '',
				password: '',
			},
			receive: {
				login: {
					modelPath: 'account' as const,
					id: '',
				},
				signup: {
					modelPath: 'user' as const,
					id: '',
				},
			},
		},
		supervisor: {
			send: {
				email: '',
				password: '',
			},
			receive: {
				login: {
					modelPath: 'account' as const,
					id: '',
				},
				signup: {
					modelPath: 'supervisor' as const,
					id: '',
				},
			},
		},
	},
	signup: {
		user: {
			send: 'create_user' as const,
			receive: '',
		},
		manager: {
			send: 'create_manager' as const,
			receive: '',
		},
		admin: {
			send: 'create_admin' as const,
			receive: '',
		},
	},
	app: {
		childList: {
			send: {
				parentId: '',
				parentModelPath: '',
				childModelPath: '',
				pagging: {
					page: 0,
					limit: 0,
					select: {},
					sort: {},
					query: {},
				},
			},
			receive: {} as AccountInterface[],
		},
		padiezdList: {
			send: {
				quarterId: '',
			},
			receive: {} as PadiezdInterface[],
		},
		buildingList: {
			send: {
				quarterId: '',
			},
			receive: {} as BuildingInterface[],
		},
	},
	client: {
		firstConnect: {
			send: {
				quarterId: '',
			},
			receive: {} as BuildingInterface[],
		},
		create: {
			send: {
				entrepriseId: '',
				name: '',
				email: '',
				telephone: '',
				room: 0,
				etage: 0,
				lastName: '',
				padiezd: '',
				quarterId: '',
				status: '',
			},
			receive: {} as BuildingInterface[],
		},
	},
	server: {
		disconnection: {
			send: {},
			receive: true,
		},
		currentClient: {
			send: {},
			receive: {
				login: {
					modelPath: '',
					id: '',
				},
				signup: {
					modelPath: '',
					id: '',
				},
			},
		},
	},
} satisfies ControllerType;
export const Descriptions = {
	test: {
		simpleArray: [
			{
				type: Number,
			},
		],
		fileArray: [
			{
				type: String,
				file: {},
			},
		],
		bigint: {
			type: String,
		},
		bool: {
			type: Boolean,
		},
		str: {
			type: String,
		},
		num: {
			type: Number,
		},
		stringMap: {
			type: Map,
			of: '',
		},
		numberMap: {
			type: Map,
			of: 0,
		},
		ojectData: {
			type: { salut: '', famille: '', nombreuse: 0 },
		},
		refArray_of_test: [
			{
				type: String,
				ref: 'test' as const,
				alien: true,
			},
		],
		ref_of_test: {
			type: String,
			ref: 'test' as const,
			strictAlien: true as const,
		},
		// _id: {
		//   type: String
		// },
		// __createdAt: {
		//   type: Number
		// },
		// __updatedAt: {
		//   type: Number
		// },
	},
	user: {
		account: {
			type: String,
			ref: 'account' as const,
			required: true,
		},
		messenger: {
			type: String,
			ref: 'messenger' as const,
		},
		entreprise: {
			type: String,
			ref: 'entreprise' as const,
			strictAlien: true,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	label: {
		label: {
			type: String,
		},
		votes: {
			type: Number,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	survey: {
		options: [
			{
				type: String,
				ref: 'label' as const,
				required: true,
			},
		],
		totalVotes: {
			type: Number,
		},
		delay: {
			type: Number,
			required: true,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	post: {
		client: {
			type: String, // modelPath user / manager / supervisor,
		},
		padiezd: {
			type: String,
			ref: 'padiezd' as const,
			strictAlien: true,
		},
		theme: {
			type: String,
		},
		survey: {
			type: String,
			ref: 'survey' as const,
		},
		statPost: {
			type: {
				likes: Number,
				comments: Number,
				shares: Number,
				totalCommentsCount: Number,
				isLiked: Boolean,
			},
		},
		message: {
			type: String,
			ref: 'message' as const,
			required: true as const,
		},

		type: {
			type: String,
		},

		comments: [
			{
				type: String,
				ref: 'post' as const,
				required: true as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	message: {
		account: {
			type: String,
			ref: 'account' as const,
			strictAlien: true as const,
		},
		text: {
			type: String,
		},
		files: [
			{
				type: String,
				file: {},
				//checkout:true,
			},
		],
		targets: [
			{
				type: String,
				ref: 'account' as const, /////
			},
		],
		status: {
			type: {
				send: Number,
				received: Number,
				seen: Number,
			},
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	manager: {
		account: {
			type: String,
			ref: 'account' as const,
			required: true as const,
		},
		messenger: {
			type: String,
			ref: 'messenger' as const,
		},
		entreprise: {
			type: String,
			ref: 'entreprise' as const,
			strictAlien: true,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	account: {
		name: {
			type: String,
			required: true as const,
		},
		email: {
			type: String,
			required: true as const,
		},
		userTarg: {
			type: String,
		},
		status: {
			type: String,
		},
		password: {
			type: String,
			required: true as const,
		},
		telephone: {
			type: String,
			required: true as const,
		},
		address: {
			type: String,
			ref: 'address' as const,
		},
		profile: {
			type: String,
			ref: 'profile' as const,
			required: true as const,
		},
		favorites: {
			type: String,
			ref: 'favorites' as const,
		},
		historique: {
			type: String,
			ref: 'historique' as const,
		},
		notification: {
			type: String,
			ref: 'notification' as const,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	activity: {
		poster: {
			type: String,
			ref: 'profile' as const,
			required: true as const,
		},
		listAbonne: [
			{
				type: String,
			},
		],
		listen: {
			type: Boolean,
		},
		channel: [
			{
				type: String,
				ref: 'post' as const,
			},
		],
		name: {
			type: String,
			required: true as const,
		},
		description: {
			type: String,
		},
		icon: [
			{
				type: String,
				required: true as const,
				file: {},
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	messenger: {
		listDiscussion: [
			{
				type: String,
				ref: 'discussion' as const,
				alien: true as const,
			},
		],
		archives: [
			{
				type: String,
				ref: 'discussion' as const,
				alien: true as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	address: {
		location: {
			type: String,
		},
		quarter: {
			type: String,
			ref: 'quarter' as const,
			strictAlien: true as const,
		},
		building: {
			type: String,
			ref: 'building' as const,
			strictAlien: true as const,
		},
		room: {
			type: Number,
			required: true as const,
		},
		padiezd: {
			type: String,
			ref: 'padiezd' as const,
			strictAlien: true as const,
		},
		city: {
			type: String,
			required: true as const,
		},
		door: {
			type: String,
			required: true as const,
		},
		etage: {
			type: String,
			required: true as const,
		},

		description: {
			type: String,
			required: true as const,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	building: {
		name: {
			type: String,
			required: true as const,
		},
		city: {
			type: String,
		},
		threadBuilding: [
			{
				type: String,
				ref: 'post' as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	discussion: {
		members: [
			{
				type: String,
				ref: 'account' as const,
				required: true as const,
				strictAlien: true as const,
			},
		],
		account1: {
			type: String,
			ref: 'account' as const,
			strictAlien: true as const,
		},
		account2: {
			type: String,
			ref: 'account' as const,
			strictAlien: true as const,
		},

		isGroup: {
			type: Boolean,
			required: true as const,
		},
		channel: [
			{
				type: String,
				ref: 'message' as const,
				required: true as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},

	entreprise: {
		managers: [
			{
				type: String,
				//ref: ConstructionManagerModel.modelName,
				ref: 'manager' as const,
				// strictAlien: true,
			},
		],
		quarters: [
			{
				type: String,
				ref: 'quarter' as const,
				// strictAlien: true,
			},
		],
		address: {
			type: String,
			ref: 'adrress' as const,
		},
		telephone: [
			{
				type: Number,
			},
		],
		email: {
			type: String,
		},
		name: {
			type: String,
		},
		webPageUrl: {
			type: String,
		},
		profile: {
			type: String,
			ref: 'profile' as const,
		},
		creationDate: {
			type: Date,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	quarter: {
		name: {
			type: String,
			required: true as const,
		},
		city: {
			type: String,
			required: true as const,
		},
		buildings: [
			{
				type: String,
				ref: 'building' as const,
			},
		],
		supervisors: [
			{
				type: String,
				ref: 'supervisor' as const,
			},
		],
		supervisorThread: [
			{
				type: String,
				ref: 'post' as const,
			},
		],
		Thread: [
			{
				type: String,
				ref: 'post' as const,
			},
		],
		activities: [
			{
				type: String,
				ref: 'activity' as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	admin: {
		app: {
			type: String,
			ref: 'app' as const,
		},
		email: {
			type: String,
			required: true as const,
		},
		password: {
			type: String,
			required: true as const,
		},
		key: {
			type: String,
			required: true as const,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	app: {
		entreprises: [
			{
				type: String,
				ref: 'entreprise' as const,
			},
		],
		admins: [
			{
				type: String,
				ref: 'admin' as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	supervisor: {
		account: {
			type: String,
			ref: 'account' as const,
			required: true as const,
		},
		messenger: {
			type: String,
			ref: 'messenger' as const,
		},
		entreprise: {
			type: String,
			ref: 'entreprise' as const,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	favorites: {
		elements: [
			{
				type: {
					id: '',
					modelName: '',
				},
				required: true,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	profile: {
		imgProfile: [
			{
				type: String,
				file: {},
			},
		],

		banner: [
			{
				type: String,
				file: {},
			},
		],

		message: {
			type: String,
			required: true as const,
		},
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
		__parentList: [
			{
				type: {
					modelPath: String,
					id: String,
				},
			},
		],
	},
	padiezd: {
		number: {
			type: Number,
			required: true as const,
		},
		users: [
			{
				type: String,
				ref: 'user' as const,
				alien: true as const,
			},
		],
		channel: [
			{
				type: String,
				ref: 'post' as const,
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
	},
	historique: {
		elements: [
			{
				type: {
					id: '',
					modelName: '',
					mode: '',
					value: '',
				},
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
	},
	notification: {
		elements: [
			{
				type: {
					triggerAccountId: '',
					targetPostId: '',
					mode: '', // like , shrared, comment,
					value: '', //bool   accountId  commentId
					checked: false,
				},
			},
		],
		_id: {
			type: String,
		},
		__createdAt: {
			type: Number,
		},
		__updatedAt: {
			type: Number,
		},
	},
} satisfies DescriptionsType;

type CacheType = {
	[kek in keyof typeof Descriptions]: any;
};
export const CacheValues = {
	messenger: {
		_id: '',
		discussions: [],
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as MessengerInterface,
	entreprise: {
		_id: '',
		address: '',
		creationDate: 0,
		email: '',
		name: '',
		managers: [],
		profile: '',
		quarters: [],
		telephone: [],
		webPageUrl: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as EntrepriseInterface,
	account: {
		_id: '',
		name: '',
		email: '',
		userTarg: '',
		status: '',
		password: '',
		historique: '',
		notification: '',
		telephone: '',
		address: '',
		favorites: '',
		profile: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as AccountInterface,
	manager: {
		_id: '',
		account: '',
		entreprise: '',
		messenger: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as ManagerInterface,
	profile: {
		_id: '',
		imgProfile: [],
		banner: [],
		message: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as ProfileInterface,
	address: {
		_id: '',
		location: '',
		room: 0,
		padiezd: 0,
		etage: 0,
		description: '',
		city: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as AddressInterface,
	activity: {
		poster: '',
		channel: [],
		name: '',
		listAbonne: [],
		description: '',
		icon: [],
		listen: false,
		_id: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as ActivityInterface,
	building: {
		_id: '',
		name: '',
		city: '',
		padiezdList: [],
		threadBuilding: [],
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as BuildingInterface,
	discussion: {
		_id: '',
		members: [],
		account1: '',
		account2: '',
		isGroup: false,
		channel: [],
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as DiscussionInterface,
	favorites: {
		elements: [],
		_id: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as FavoritesInterface,
	historique: {
		elements: [],
		_id: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as HistoriqueInterface,
	notification: {
		elements: [],
		_id: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as NotificationInterface,
	message: {
		_id: '',
		account: '',
		files: [],
		targets: [],
		status: {
			received: 0,
			seen: 0,
			send: 0,
		},
		text: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as MessageInterface,

	label: {
		_id: '',
		label: '',
		votes: 0,
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as LabelInterface,
	survey: {
		_id: '',
		options: [],
		totalVotes: 0,
		delay: 0,
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as SurveyInterface,
	post: {
		_id: '',
		message: '',
		comments: [],
		client: '',
		padiezd: '',
		survey: '',
		type: '',
		theme: '',
		statPost: {
			likes: 0,
			comments: 0,
			shares: 0,
			totalCommentsCount: 0,
			isLiked: false,
		},
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as PostInterface,
	user: {
		_id: '',
		account: '',
		messenger: '',
		entreprise: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as UserInterface,
	admin: {
		_id: '',
		account: '',
		messenger: '',
		entreprise: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as AdminInterface,
	app: {
		_id: '',
		entreprises: [],
		admins: [],
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as AppInterface,
	padiezd: {
		_id: '',
		number: 0,
		users: [],
		channel: [],
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as PadiezdInterface,
	quarter: {
		_id: '',
		name: '',
		city: '',
		buildings: [],
		supervisors: [],
		supervisorThread: [],
		Thread: [],
		activities: [],
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as QuarterInterface,
	supervisor: {
		_id: '',
		account: '',
		messenger: '',
		entreprise: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as SupervisorInterface,

	test: {
		_id: '',
		simpleArray: [],
		fileArray: [],
		bigint: '',
		bool: false,
		str: '',
		num: 0,
		stringMap: new Map<string, string>(),
		numberMap: new Map<string, number>(),
		ojectData: { salut: '', famille: '', nombreuse: 0 },
		refArray_of_test: [],
		ref_of_test: '',
		__createdAt: 0,
		__updatedAt: 0,
		__parentList: [],
	} as TestInterface,
} satisfies CacheType;
export interface LabelInterface {
	_id: string;
	label: string;
	votes: number;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface SurveyInterface {
	_id: string;
	options: string[];
	totalVotes: number;
	delay: number;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface TestInterface {
	simpleArray?: number[];
	fileArray?: UrlData[];
	bigint?: String;
	bool?: boolean;
	str?: string;
	num?: number;
	stringMap?: Map<string, string>;
	numberMap?: Map<string, number>;
	ojectData?: { salut: string; famille: string; nombreuse: number };
	refArray_of_test?: string[];
	ref_of_test?: string;
	_id: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface MessageInterface {
	account: string;
	text: string;
	files: UrlData[];
	targets: string[];
	status: {
		send: number;
		received: number;
		seen: number;
	};
	_id: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface SupervisorInterface {
	_id: string;
	account: string;
	messenger: string;
	entreprise: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface AppInterface {
	_id: string;
	entreprises: string[];
	admins: string[];
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface AdminInterface {
	_id: string;
	account: string;
	messenger: string;
	entreprise: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface PostInterface {
	client: string;
	padiezd: string;
	theme: string;
	_id: string;
	message: string;
	survey: string;
	statPost: {
		likes: number;
		comments: number;
		shares: number;
		totalCommentsCount: number;
		isLiked: boolean;
	};
	type: string;
	comments: string[];
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface FavoritesInterface {
	elements: { id: string; modelName: string }[];
	_id: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}

export interface HistoriqueInterface {
	elements: {
		id: string;
		modelName: 'post' | 'activity';
		mode: 'like' | 'shared' | 'create' | 'listen';
		value: string;
	}[];
	_id: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}

export interface NotificationInterface {
	elements: {
		triggerAccountId: string;
		targetPostId: string;
		mode: 'like' | 'shared' | 'create'; // like , shrared, comment,
		value: string | boolean; //bool   accountId  commentId
		checked: boolean;
	}[];
	_id: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface DiscussionInterface {
	_id: string;
	members: string[];
	account1: string;
	account2: string;
	isGroup: boolean;
	channel: string[];
	__createdAt: number;
	__updatedAt: number;
}
export interface ActivityInterface {
	poster: string;
	channel: string[];
	listen: boolean;
	listAbonne: string[];
	name: string;
	description: string;
	icon: UrlData[];
	_id: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface MessengerInterface {
	_id: string;
	discussions: string[];
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}

export interface ProfileInterface {
	_id: string;
	imgProfile: UrlData[];
	banner: UrlData[];
	message: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface AddressInterface {
	_id: string;
	location: string;
	room: number;
	padiezd: number;
	etage: number;
	description: string;
	city: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}

export interface EntrepriseInterface {
	_id: string;
	managers: string[];
	quarters: string[];
	address: string;
	name: string;
	telephone: string[];
	email: string;
	webPageUrl: string;
	profile: string;
	creationDate: number;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface ManagerInterface {
	_id: string;
	account: string;
	messenger: string;
	entreprise: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface BuildingInterface {
	_id: string;
	name: string;
	city: string;
	padiezdList: string[];
	threadBuilding: string[];
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface QuarterInterface {
	_id: string;
	name: string;
	city: string;
	buildings: string[];
	supervisors: string[];
	Thread: string[];
	activities: string[];
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface PadiezdInterface {
	_id: string;
	number: number;
	users: string[];
	channel: string[];
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface UserInterface {
	_id: string;
	account: string;
	messenger: string;
	entreprise: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export interface AccountInterface {
	_id: string;
	name: string;
	email: string;
	userTarg: string;
	status: string;
	password: string;
	historique: string;
	notification: string;
	telephone: string;
	address: string;
	favorites: string;
	profile: string;
	__createdAt: number;
	__updatedAt: number;
	__parentList: {
		modelPath: string;
		id: string;
	}[];
}
export type ModelSchema<K extends keyof typeof Descriptions> = (typeof Descriptions)[K];

//export type ModelCache<K extends keyof typeof Descriptions> = typeof Cache[K];
