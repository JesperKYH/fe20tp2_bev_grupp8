import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../firebase';
import { ContentWrapper } from './SignUpElements';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import LogoLets from '../svgs/LogoLets';

const SignUp = () => (
    <div>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    partOfOrg: 0, // why not just default to true
    usernameTaken: false,
    username: '',
    organization: '',
    colors: {
        primaryColor: {
            h: 38,
            l: 50,
            s: 100,
        },
    },
    Logo: {
        Logo: '',
    },
    currency: {
        currency: 100000,
    },
    followingStocks: {
        LV: {
            regularMarketChangePercent: 150,
            regularMarketPrice: 250,
            shortName: 'lets-vest',
            symbol: 'LV',
        },
    },
    followingCrypto: {
        LVCry: {
            regularMarketChangePercent: 150,
            regularMarketPrice: 250,
            name: 'lets-vest-Cry',
            image: 'LV-CrY',
            symbol: 'LVCry',
        },
    },
    possessionStocks: {
        LV: {
            regularMarketPrice: 250,
            shortName: 'lets-vest',
            symbol: 'LV',
            amount: 1,
        },
    },
    possessionCrypto: {
        LVCry: {
            price: 250,
            percent: 150,
            name: 'lets-vest-CrY',
            image: 'LV-CrY',
            amount: 1,
        },
    },
    post: {
        posts: [
            {
                content: "Let's Vest is the best website ever!",
                username: "Let's Vest",
                liked: true,
                likeCount: 299,
                timestamp: 736180964,
            },
        ],
    },
    userSettings: {
        settings: {
            recommended: true,
            watchingCryptos: true,
            watchingSecuritys: true,
            news: true,
        },
    },
    following: {
        LetsVest: {
            email: 'letsvest@vest.com',
            username: 'Vest',
        },
    },
    picture: {
        profile_pic: 'null',
    },
    email: '',

    list: [
        {
            email: 'letsvest@vest.com',
        },
    ],
    passwordOne: '',
    passwordTwo: '',
    error: null,
    isAdmin: false,
    partOfOrganization: false,
    loading: false,
    organizationname: '',
    likedPosts: [
        {
            content: "Let's Vest is the best website ever!",
            username: "Let's Vest",
            liked: true,
            likeCount: 299,
            timestamp: 736180964,
        },
    ],
};

let activeOrganizations;
let currentEmails;
let activeOrganizationsName = [];

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    checkUsernameTaken = (str) => {
        this.setState({ usernameTaken: false });

        const usersRef = this.props.firebase.users();
        // const usersRef = this.props.firebase.db.ref('users/');

        // usersRef.startAt(null, str).endAt(null, str).on("value", () => {
        // 		console.log("Username already in use!");
        // 		this.setState({ usernameTaken: true });
        // });

        usersRef
            .orderByChild('username')
            .equalTo(str)
            .on('child_added', () => {
                console.log('Username already in use!');
                this.setState({ usernameTaken: true });
            });
    };

    componentDidMount = () => {
        /*   console.log('hello') */
        const activeOrganizationsFirebase = this.props.firebase.db.ref(
            'organizations/'
        );

        activeOrganizationsFirebase.on('value', (snapshot) => {
            activeOrganizations = snapshot.val();
            if (!activeOrganizations) return;

            for (const key in activeOrganizations) {
                activeOrganizationsName.push({ key });
            }
        });
    };

    onSubmit = (event) => {
        this.setState({ loading: true });
        const {
            username,
            email,
            passwordOne,
            isAdmin,
            currency,
            followingStocks,
            followingCrypto,
            possessionStocks,
            possessionCrypto,
            post,
            picture,
            organization,
            organizationname,
            partOfOrganization,
            list,
            userSettings,
            likedPosts,
            colors,
            Logo,
        } = this.state;

        if (partOfOrganization) {
            const orgEmailList = this.props.firebase.db.ref(
                'organizations/' + organizationname + '/emails/list'
            );

            orgEmailList.on('value', (snapshot) => {
                currentEmails = snapshot.val();
                if (!currentEmails) return;

                const index = currentEmails.findIndex(
                    (obj) => obj.email == email
                );

                if (index === -1) {
                    // this.setState({ partOfOrg: false });
                    this.state.partOfOrg = false;
                } else {
                    // this.setState({ partOfOrg: true });
                    this.state.partOfOrg = true;
                }
            });
        }

        console.log(`partOfOrg: ${this.state.partOfOrg}`);

        if (this.state.partOfOrg === false) {
            this.setState({ loading: false });
            return;
        }

        const roles = {};
        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        } else if (partOfOrganization) {
            roles[ROLES.EMPLOYEE] = ROLES.EMPLOYEE;
        }
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then((authUser) => {
                // Create a user in your Firebase realtime database that is not part of an organization
                if (!isAdmin && !partOfOrganization) {
                    return this.props.firebase.user(authUser.user.uid).set({
                        username,
                        email,
                        roles,
                        currency,
                        followingStocks,
                        followingCrypto,
                        possessionStocks,
                        possessionCrypto,
                        post,
                        picture,
                        organization,
                        userSettings,
                        likedPosts,
                    });
                    // Create a user in your Firebase realtime database that is part of an organization
                } else {
                    if (isAdmin) {
                        this.props.firebase.organization(organization).update({
                            colors,
                            Logo,
                        });
                        this.props.firebase
                            .organization(
                                organization + '/users/' + authUser.user.uid
                            )
                            .set({
                                username,
                                email,
                                roles,
                                currency,
                                followingStocks,
                                followingCrypto,
                                possessionStocks,
                                possessionCrypto,
                                post,
                                picture,
                                organization,
                                userSettings,
                                likedPosts,
                            });
                        this.props.firebase
                            .organization(organization + '/emails')
                            .set({ list });
                        this.props.firebase.user(authUser.user.uid).set({
                            username,
                            email,
                            roles,
                            currency,
                            followingStocks,
                            followingCrypto,
                            possessionStocks,
                            possessionCrypto,
                            post,
                            picture,
                            organization,
                            userSettings,
                            likedPosts,
                        });
                    } else {
                        this.props.firebase
                            .organization(
                                organizationname + '/users/' + authUser.user.uid
                            )
                            .set({
                                username,
                                email,
                                roles,
                                currency,
                                followingStocks,
                                followingCrypto,
                                possessionStocks,
                                possessionCrypto,
                                post,
                                picture,
                                organization: organizationname,
                                userSettings,
                                likedPosts,
                            });
                        this.props.firebase.user(authUser.user.uid).set({
                            username,
                            email,
                            roles,
                            currency,
                            followingStocks,
                            followingCrypto,
                            possessionStocks,
                            possessionCrypto,
                            post,
                            picture,
                            userSettings,
                            organization: organizationname,
                            likedPosts,
                        });
                    }
                }
            })

            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch((error) => {
                this.setState({ error, loading: false });
            });
        event.preventDefault();
    };
    onChange = (event) => {
        if (/\s/.test(event.target.value)) {
            // It has any kind of whitespace
            // göra error
            return;
        }

        // console.log(event.target.value)
        this.setState({ [event.target.name]: event.target.value });
        this.checkUsernameTaken(event.target.value);
    };

    onChangeCheckbox = (event) => {
        if (
            event.target.name === 'partOfOrganization' &&
            this.state.isAdmin === true
        ) {
            this.setState({ isAdmin: false });
        } else if (
            event.target.name === 'isAdmin' &&
            this.state.partOfOrganization === true
        ) {
            this.setState({ partOfOrganization: false });
        }
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
            organization,
            partOfOrganization,
            organizationname,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '' ||
            this.state.usernameTaken;

        return (
            <ContentWrapper>
                {/*     <h1>Let's Vest</h1> */}
                <LogoLets className="logo-lets" />
                {this.state.loading ? (
                    'Loading...'
                ) : (
                    <>
                        <h3>Create your account</h3>
                        <form onSubmit={this.onSubmit}>
                            <label>
                                Username
                                <input
                                    name="username"
                                    value={username}
                                    onChange={this.onChange}
                                    type="text"
                                    placeholder="Username"
                                />
                            </label>
                            <label>
                                E-mail
                                <input
                                    name="email"
                                    value={email}
                                    onChange={this.onChange}
                                    type="email"
                                    placeholder="E-mail address"
                                />
                            </label>
                            <label>
                                Password
                                <input
                                    name="passwordOne"
                                    value={passwordOne}
                                    onChange={this.onChange}
                                    type="password"
                                    placeholder="Password"
                                />
                            </label>
                            <label>
                                Confirm password
                                <input
                                    name="passwordTwo"
                                    value={passwordTwo}
                                    onChange={this.onChange}
                                    type="password"
                                    placeholder="Confirm password"
                                />
                            </label>
                            <label className="side-by-side">
                                Create an organization
                                <input
                                    name="isAdmin"
                                    type="checkbox"
                                    checked={isAdmin}
                                    onChange={this.onChangeCheckbox}
                                />
                            </label>
                            {isAdmin ? (
                                <label>
                                    {' '}
                                    Name of organization
                                    <input
                                        name="organization"
                                        value={organization}
                                        onChange={this.onChange}
                                    />{' '}
                                </label>
                            ) : (
                                ''
                            )}

                            <label className="side-by-side">
                                Part of an organization
                                <input
                                    name="partOfOrganization"
                                    type="checkbox"
                                    checked={partOfOrganization}
                                    onChange={this.onChangeCheckbox}
                                />
                            </label>
                            {partOfOrganization ? (
                                <label>
                                    {' '}
                                    Which organization?{' '}
                                    <select
                                        name="organizationname"
                                        value={organizationname}
                                        onChange={this.onChange}
                                    >
                                        <option>Select company...</option>
                                        {activeOrganizationsName.map(
                                            (item, i) => {
                                                return (
                                                    <option key={i}>
                                                        {item.key}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </label>
                            ) : (
                                ''
                            )}

                            <button disabled={isInvalid} type="submit">
                                Sign Up
                            </button>
                            {error && (
                                <p className="error-message">{error.message}</p>
                            )}

                            <p>
                                Already have an account?{' '}
                                <Link to={ROUTES.SIGN_IN}>Sign in</Link>
                            </p>
                        </form>
                    </>
                )}
            </ContentWrapper>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUp;

export { SignUpForm, SignUpLink };
