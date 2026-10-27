import type { Locale } from "./config";

/**
 * Translation dictionaries.
 *
 * English is the reference dictionary: its keys define TranslationKey, and
 * the French dictionary is typed as Record<TranslationKey, string>, so the
 * build fails if a translation is missing.
 *
 * Values may contain {placeholders} replaced by the translate() helper.
 *
 * Note: country names in src/lib/countries.ts are intentionally not
 * translated yet (see docs/FRONTEND_GUIDE.md).
 */
const en = {
  // ---- Shared UI ----
  "common.signIn": "Sign in",
  "common.signOut": "Sign out",
  "common.createAccount": "Create account",
  "common.optional": "optional",
  "common.requiredMark": "required",

  // ---- Language switcher ----
  "language.label": "Language",
  "language.switchTo": "Switch to {language}",
  "language.current": "Current language: {language}",

  // ---- Loading ----
  "loading.content": "Loading content",
  "loading.page": "Loading",

  // ---- Form controls ----
  "field.showPassword": "Show password",
  "field.hidePassword": "Hide password",
  "nav.open": "Open navigation",
  "nav.close": "Close navigation",

  // ---- Sidebar / navigation ----
  "sidebar.menu": "Menu",
  "sidebar.account": "Account",
  "nav.dashboard": "Dashboard",
  "nav.overview": "Overview",
  "nav.surveys": "Surveys",
  "nav.offerwalls": "Offerwalls",
  "nav.affiliates": "Affiliate Programmes",
  "nav.earnings": "Earnings History",
  "nav.referrals": "Referrals",
  "nav.profile": "Profile and Settings",
  "nav.help": "Help and Support",
  "nav.logout": "Sign out",
  "nav.soon": "Soon",
  "nav.logoutUnavailable":
    "Sign out will be available once authentication is connected.",

  // ---- Dashboard interface ----
  "dashboard.greeting": "Welcome back, {name}.",
  "dashboard.greetingFallback": "Welcome back.",
  "dashboard.welcomeMessage":
    "Discover new earning opportunities below and track your rewards as they grow.",
  "dashboard.exploreOpportunities": "Explore Opportunities",
  "dashboard.profileMenuLabel": "Profile menu",
  "dashboard.profileSettings": "Profile and Settings",
  "dashboard.previewBannerTitle": "Development preview",
  "dashboard.previewBannerBody":
    "The earnings, opportunities, and activity below are clearly marked sample data - not real account information.",
  "dashboard.previewStateLabel": "Preview state",
  "dashboard.stateLoaded": "Loaded",
  "dashboard.stateNewUser": "New user",
  "dashboard.stateNoEarnings": "No earnings data",
  "dashboard.stateNoOpportunities": "No opportunities",
  "dashboard.stateNoReferrals": "No referral info",
  "dashboard.stateError": "Error",
  "dashboard.notConnectedTitle": "Data source not connected",
  "dashboard.notConnectedBody":
    "The dashboard data service is not connected to a backend yet. The interface is ready; see docs/BACKEND_INTEGRATION.md for the contracts to define.",
  "dashboard.errorTitle": "Could not load your dashboard",
  "dashboard.errorBody":
    "Something went wrong while fetching your earning data. Please try again.",
  "dashboard.retry": "Retry",

  // ---- Earnings overview ----
  "earnings.totalEarned": "Total Earned",
  "earnings.available": "Available Earnings",
  "earnings.pending": "Pending Earnings",
  "earnings.notAvailable": "Not available",
  "earnings.notAvailableHelper":
    "This will appear once the data source is connected.",

  // ---- Ways to Earn ----
  "opportunities.title": "Ways to Earn",
  "opportunities.emptyTitle": "No earning opportunities yet",
  "opportunities.emptyBody":
    "New ways to earn will appear here as integrations go live.",
  "opp.comingSoon": "Coming soon",
  "opp.surveys.title": "Surveys",
  "opp.surveys.desc":
    "Answer short surveys and earn points or rewards for eligible responses.",
  "opp.surveys.action": "Explore Surveys",
  "opp.offerwalls.title": "Offerwalls",
  "opp.offerwalls.desc":
    "Complete eligible tasks, like trying applications or signing up for services, to earn rewards.",
  "opp.offerwalls.action": "Explore Offerwalls",
  "opp.affiliates.title": "Affiliate Programmes",
  "opp.affiliates.desc":
    "Share eligible product or service links and potentially earn commissions from qualifying actions.",
  "opp.affiliates.action": "Explore Affiliates",
  "opp.referrals.title": "Referrals",
  "opp.referrals.desc":
    "Invite others to TryQash and you may earn referral rewards under the platform's referral rules.",
  "opp.referrals.action": "Invite Friends",

  // ---- Recent Activity ----
  "activity.title": "Recent Activity",
  "activity.emptyTitle": "No activity yet",
  "activity.emptyBody":
    "Complete your first earning activity and it will appear here.",
  "activity.colDescription": "Description",
  "activity.colSource": "Source",
  "activity.colDate": "Date",
  "activity.colReward": "Reward",
  "activity.colStatus": "Status",
  "activity.scrollHint": "Swipe to see more",
  "activity.sourceSurvey": "Survey",
  "activity.sourceOfferwall": "Offerwall",
  "activity.sourceAffiliate": "Affiliate",
  "activity.sourceReferral": "Referral",
  "activity.statusPending": "Pending",
  "activity.statusApproved": "Approved",
  "activity.statusRejected": "Rejected",

  // ---- Referral summary ----
  "referral.title": "Referral Programme",
  "referral.desc":
    "Invite friends and you may earn referral rewards under the platform's referral rules once confirmed.",
  "referral.codeLabel": "Your referral code",
  "referral.codeUnavailable": "Referral code unavailable",
  "referral.copy": "Copy code",
  "referral.copied": "Copied",
  "referral.copyFailed": "Copy failed; select and copy manually.",
  "referral.friendsJoined": "Friends joined",
  "referral.rewardsPending": "Rewards pending",
  "referral.viewFull": "View referral programme",
  "referral.viewFullSoon": "Full referral details will appear once available.",

  // ---- Getting started ----
  "gettingStarted.title": "Getting started",
  "gettingStarted.step1": "Explore available earning opportunities.",
  "gettingStarted.step2": "Complete an eligible task or survey.",
  "gettingStarted.step3": "Track the status of your earned rewards.",
  "gettingStarted.step4": "Explore affiliate opportunities or referrals when available.",

  // ---- Login ----
  "login.metaTitle": "Sign in",
  "login.metaDescription": "Sign in to your TryQash account.",
  "login.title": "Sign in",
  "login.description":
    "Use your email or username to access your account.",
  "login.identifierLabel": "Email or username",
  "login.identifierPlaceholder": "you@example.com",
  "login.passwordLabel": "Password",
  "login.passwordPlaceholder": "Your password",
  "login.forgotLink": "Forgot password?",
  "login.submit": "Sign in",
  "login.footerPrompt": "New to TryQash?",
  "login.footerLink": "Create an account",

  // ---- Registration ----
  "register.metaTitle": "Create account",
  "register.metaDescription": "Create your TryQash account.",
  "register.title": "Create your account",
  "register.description":
    "Register with your email, username, country, and password.",
  "register.emailLabel": "Email",
  "register.emailPlaceholder": "you@example.com",
  "register.usernameLabel": "Username",
  "register.usernamePlaceholder": "e.g. qash_user",
  "register.usernameHelper": "3 to 20 letters, numbers, or underscores.",
  "register.countryLabel": "Country",
  "register.countryPlaceholder": "Select your country",
  "register.passwordLabel": "Password",
  "register.passwordPlaceholder": "At least 8 characters",
  "register.passwordHelper": "Provisional rule: minimum 8 characters.",
  "register.confirmLabel": "Confirm password",
  "register.confirmPlaceholder": "Repeat your password",
  "register.referralLabel": "Referral code (optional)",
  "register.referralPlaceholder": "Code of the person who referred you",
  "register.submit": "Create account",
  "register.continueToSignIn": "Continue to sign in",
  "register.footerPrompt": "Already have an account?",
  "register.footerLink": "Sign in",

  // ---- Email verification ----
  "verifyEmail.metaTitle": "Verify your email",
  "verifyEmail.metaDescription":
    "Enter the verification code sent to your email address.",
  "verifyEmail.title": "Verify your email",
  "verifyEmail.description":
    "We sent a six-digit verification code to your email address. Enter it below to continue.",
  "verifyEmail.codeLabel": "Verification code",
  "verifyEmail.digitLabel": "Digit {number} of {total}",
  "verifyEmail.codeHelper": "Enter the six digits from your email.",
  "verifyEmail.codeIncomplete": "Enter all six digits of the code.",
  "verifyEmail.submit": "Verify email",
  "verifyEmail.resend": "Resend code",
  "verifyEmail.resendIn": "Resend code in {seconds}s",
  "verifyEmail.resendSent": "A new code has been sent to your email address.",
  "verifyEmail.wrongEmail": "Wrong email address?",
  "verifyEmail.registerAgain": "Register again",
  "verifyEmail.successTitle": "Email verified",
  "verifyEmail.successBody":
    "Your email address has been verified. You can now sign in.",
  "verifyEmail.continueToSignIn": "Continue to sign in",
  "verifyEmail.expiredTitle": "Code expired",
  "verifyEmail.expiredBody":
    "This verification code has expired. Request a new code to continue.",
  "verifyEmail.requestNew": "Request a new code",
  "verifyEmail.errorNotConnected":
    "Email verification is not connected to the backend yet. This is a frontend preview.",
  "verifyEmail.errorInvalidCode":
    "This code is incorrect. Check it and try again.",
  "verifyEmail.errorRateLimited":
    "Too many attempts. Please wait before trying again.",
  "verifyEmail.errorUnknown":
    "Something went wrong while verifying your email. Please try again.",

  // ---- Forgot password ----
  "forgot.metaTitle": "Forgot password",
  "forgot.metaDescription":
    "Request password recovery instructions for your TryQash account.",
  "forgot.title": "Forgot password",
  "forgot.description":
    "Enter your account email and we will send recovery instructions.",
  "forgot.emailLabel": "Email",
  "forgot.emailPlaceholder": "you@example.com",
  "forgot.emailHelper": "We will send recovery instructions to this address.",
  "forgot.submit": "Send recovery email",
  "forgot.successTitle": "Check your email",
  "forgot.successBody":
    "If an account exists for {email}, password recovery instructions are on their way. Follow the link in that email to set a new password.",
  "forgot.backToSignIn": "Back to sign in",
  "forgot.footerPrompt": "Remembered it after all?",

  // ---- Reset password ----
  "reset.metaTitle": "Set a new password",
  "reset.metaDescription": "Choose a new password for your TryQash account.",
  "reset.title": "Set a new password",
  "reset.description": "Choose a new password for your account.",
  "reset.checking": "Checking your reset link...",
  "reset.invalidTitle": "Invalid or expired link",
  "reset.invalidBody":
    "This password reset link is invalid or has expired. Request a new recovery email to continue.",
  "reset.requestNew": "Request a new link",
  "reset.successTitle": "Password updated",
  "reset.successBody":
    "Your password has been changed. You can now sign in with your new password.",
  "reset.newPasswordLabel": "New password",
  "reset.newPasswordPlaceholder": "At least 8 characters",
  "reset.confirmLabel": "Confirm new password",
  "reset.confirmPlaceholder": "Repeat your new password",
  "reset.submit": "Set new password",
  "reset.footerPrompt": "Back to",
  "reset.footerLink": "sign in",

  // ---- Dashboard ----
  "dashboard.metaTitle": "Dashboard",
  "dashboard.metaDescription": "Your TryQash dashboard.",
  "dashboard.title": "Dashboard",
  "dashboard.signedInAs": "Signed in as {account}.",
  "dashboard.yourAccount": "your account",
  "dashboard.notConfiguredDescription":
    "Authentication is not configured in this environment.",
  "dashboard.signedInTitle": "You are signed in",
  "dashboard.signedInBody":
    "Authentication is active. Business content for the dashboard arrives in the next implementation task.",
  "dashboard.notConfiguredTitle": "Authentication not configured",
  "dashboard.notConfiguredBody":
    "This page is protected once a provider is configured. To enable it, create a Supabase project, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local, and restart the dev server.",
  "dashboard.placeholderCard": "Placeholder card",
  "dashboard.reserved": "Reserved for future content.",
  "dashboard.placeholderNote":
    "Placeholder content only. No application data exists yet.",

  // ---- Design preview (development page) ----
  "preview.topBar": "Design preview",
  "preview.eyebrow": "Design system",
  "preview.title": "Design system preview",
  "preview.description":
    "Temporary application shell and shared components following the approved visual reference. This page verifies the foundation before real screens are built.",
  "preview.bannerTitle": "Design preview only",
  "preview.bannerBody":
    "Layout, navigation labels, and all content shown here are placeholders for visual verification - they are not confirmed TryQash features or data.",
  "preview.primaryAction": "Primary action",
  "preview.secondaryAction": "Secondary action",
  "preview.cardsTitle": "Cards",
  "preview.cardsNote":
    "Light grey surfaces with subtle borders, per the reference. Content areas are neutral placeholders.",
  "preview.formsTitle": "Buttons and inputs",
  "preview.formsNote":
    "Compact control styles: solid black primary, bordered secondary, labelled fields.",
  "preview.buttonsTitle": "Buttons",
  "preview.buttonsNote": "Variants, states, and sizes.",
  "preview.inputsTitle": "Inputs",
  "preview.inputsNote":
    "Labels, helper text, validation, and states. Field names are samples only.",
  "preview.variants": "Variants",
  "preview.states": "States",
  "preview.sizes": "Sizes",
  "preview.processing": "Processing",
  "preview.primaryDisabled": "Primary disabled",
  "preview.secondaryDisabled": "Secondary disabled",
  "preview.small": "Small",
  "preview.medium": "Medium",
  "preview.large": "Large",
  "preview.sampleLabel": "Sample label",
  "preview.samplePlaceholder": "Placeholder text",
  "preview.sampleHelper": "Helper text adds context below the field.",
  "preview.invalidSample": "Invalid sample",
  "preview.sampleValue": "Sample value",
  "preview.sampleValidation": "This is a sample validation message.",
  "preview.disabledSample": "Disabled sample",
  "preview.disabledPlaceholder": "Disabled input",
  "preview.statusTitle": "Status indicators",
  "preview.statusNote":
    "Green for positive states, red for negative, amber for attention, grey for neutral.",
  "preview.positive": "Positive",
  "preview.attention": "Attention",
  "preview.negative": "Negative",
  "preview.neutral": "Neutral",
  "preview.notificationsTitle": "Notification tones",
  "preview.notificationsNote":
    "The default informational banner uses a neutral grey tone; status banners use semantic colors.",
  "preview.information": "Information",
  "preview.informationBody": "Neutral notices appear in this subtle grey tone.",
  "preview.warning": "Warning",
  "preview.warningBody":
    "Conditions that need attention would use this amber tone.",
  "preview.error": "Error",
  "preview.errorBody":
    "Failures would be reported in this red tone with recovery guidance.",
  "preview.tableTitle": "Table",
  "preview.tableNote":
    "Quiet uppercase headers and row dividers for readable tabular content.",
  "preview.tableItem": "Item",
  "preview.tableStatus": "Status",
  "preview.tableNoteColumn": "Note",
  "preview.tableRow": "Example row {number}",
  "preview.tablePlaceholder": "Placeholder text",
  "preview.idle": "Idle",
  "preview.tableFooter":
    "Placeholder rows - no real TryQash data is displayed.",
  "preview.placeholderCard": "Placeholder card",
  "preview.reserved": "Reserved for future content.",
  "preview.endNote":
    "End of preview. The sidebar navigation labels and all content on this page are placeholders for visual verification only.",

  "preview.loadingTitle": "Loading states",
  "preview.loadingNote":
    "Rotating ring spinners for actions, skeleton blocks for content that is still loading.",
  "preview.spinnersLabel": "Spinners",
  "preview.skeletonsLabel": "Skeletons",
  "preview.buttonLoadingLabel": "Buttons while loading",
  "preview.saving": "Saving",
  "preview.loadingExample": "Loading example",

  // ---- Validation ----
  "validation.email.required": "Enter your email address.",
  "validation.email.invalid": "Enter a valid email address.",
  "validation.password.required": "Enter a password.",
  "validation.password.tooShort": "Use at least {min} characters.",
  "validation.password.enterYours": "Enter your password.",
  "validation.confirm.required": "Confirm your password.",
  "validation.confirm.mismatch": "Passwords do not match.",
  "validation.username.required": "Choose a username.",
  "validation.username.invalid":
    "Use 3 to 20 letters, numbers, or underscores.",
  "validation.country.required": "Select your country.",
  "validation.country.invalid": "Country must be a two-letter code.",
  "validation.identifier.required":
    "Enter your email or username.",

  // ---- Authentication errors ----
  "error.notConfigured":
    "Authentication is not configured in this environment yet. Set the Supabase variables in .env.local to enable sign-in.",
  "error.connection":
    "Could not reach the authentication service. Check your connection and try again.",
  "error.invalidCredentials":
    "Invalid login details. Check your credentials and try again.",
  "error.identifierLoginUnavailable":
    "Signing in with a username is not enabled on the backend yet. Use your email address, or contact support.",
  "error.usernameTaken":
    "This username is already taken. Please choose another one.",
  "error.emailTaken":
    "An account with this email already exists. Try signing in instead.",
  "error.referralInvalid":
    "This referral code could not be accepted. Check it or leave it empty.",
} as const;

export type TranslationKey = keyof typeof en;

const fr: Record<TranslationKey, string> = {
  // ---- Shared UI ----
  "common.signIn": "Se connecter",
  "common.signOut": "Se deconnecter",
  "common.createAccount": "Creer un compte",
  "common.optional": "facultatif",
  "common.requiredMark": "obligatoire",

  // ---- Language switcher ----
  "language.label": "Langue",
  "language.switchTo": "Passer en {language}",
  "language.current": "Langue actuelle : {language}",

  // ---- Loading ----
  "loading.content": "Chargement du contenu",
  "loading.page": "Chargement",

  // ---- Form controls ----
  "field.showPassword": "Afficher le mot de passe",
  "field.hidePassword": "Masquer le mot de passe",
  "nav.open": "Ouvrir la navigation",
  "nav.close": "Fermer la navigation",

  // ---- Sidebar / navigation ----
  "sidebar.menu": "Menu",
  "sidebar.account": "Compte",
  "nav.dashboard": "Tableau de bord",
  "nav.overview": "Vue d'ensemble",
  "nav.surveys": "Sondages",
  "nav.offerwalls": "Mur d'offres",
  "nav.affiliates": "Programmes d'affiliation",
  "nav.earnings": "Historique des gains",
  "nav.referrals": "Parrainages",
  "nav.profile": "Profil et parametres",
  "nav.help": "Aide et assistance",
  "nav.logout": "Se deconnecter",
  "nav.soon": "Bientot",
  "nav.logoutUnavailable":
    "La deconnexion sera disponible une fois l'authentification connectee.",

  // ---- Dashboard interface ----
  "dashboard.greeting": "Ravi de vous revoir, {name}.",
  "dashboard.greetingFallback": "Ravi de vous revoir.",
  "dashboard.welcomeMessage":
    "Decouvrez de nouvelles facons de gagner ci-dessous et suivez vos recompenses au fur et a mesure.",
  "dashboard.exploreOpportunities": "Explorer les opportunites",
  "dashboard.profileMenuLabel": "Menu du profil",
  "dashboard.profileSettings": "Profil et parametres",
  "dashboard.previewBannerTitle": "Apercu de developpement",
  "dashboard.previewBannerBody":
    "Les gains, opportunites et activites ci-dessous sont des donnees d'exemple - pas des informations reelles du compte.",
  "dashboard.previewStateLabel": "Etat d'apercu",
  "dashboard.stateLoaded": "Charge",
  "dashboard.stateNewUser": "Nouvel utilisateur",
  "dashboard.stateNoEarnings": "Sans donnees de gains",
  "dashboard.stateNoOpportunities": "Sans opportunites",
  "dashboard.stateNoReferrals": "Sans info parrainage",
  "dashboard.stateError": "Erreur",
  "dashboard.notConnectedTitle": "Source de donnees non connectee",
  "dashboard.notConnectedBody":
    "Le service de donnees du tableau de bord n'est pas encore relie au backend. L'interface est prete ; voir docs/BACKEND_INTEGRATION.md pour les contrats a definir.",
  "dashboard.errorTitle": "Impossible de charger votre tableau de bord",
  "dashboard.errorBody":
    "Une erreur est survenue pendant la recuperation de vos gains. Veuillez reessayer.",
  "dashboard.retry": "Reessayer",

  // ---- Earnings overview ----
  "earnings.totalEarned": "Total gagne",
  "earnings.available": "Gains disponibles",
  "earnings.pending": "Gains en attente",
  "earnings.notAvailable": "Non disponible",
  "earnings.notAvailableHelper":
    "Cette valeur apparaitra une fois la source de donnees connectee.",

  // ---- Ways to Earn ----
  "opportunities.title": "Comment gagner",
  "opportunities.emptyTitle": "Aucune opportunite de gain pour le moment",
  "opportunities.emptyBody":
    "De nouvelles facons de gagner apparaitront ici a mesure que les integrations seront disponibles.",
  "opp.comingSoon": "Bientot disponible",
  "opp.surveys.title": "Sondages",
  "opp.surveys.desc":
    "Repondez a de courts sondages et gagnez des points ou des recompenses pour les reponses admissibles.",
  "opp.surveys.action": "Explorer les sondages",
  "opp.offerwalls.title": "Mur d'offres",
  "opp.offerwalls.desc":
    "Accomplissez des taches admissibles, comme tester des applications ou vous inscrire a des services, pour gagner des recompenses.",
  "opp.offerwalls.action": "Explorer les offres",
  "opp.affiliates.title": "Programmes d'affiliation",
  "opp.affiliates.desc":
    "Partagez des liens admissibles de produits ou services et gagnez eventuellement des commissions sur les actions qualifiees.",
  "opp.affiliates.action": "Explorer l'affiliation",
  "opp.referrals.title": "Parrainages",
  "opp.referrals.desc":
    "Invitez d'autres utilisateurs sur TryQash et gagnez eventuellement des recompenses de parrainage selon les regles de la plateforme.",
  "opp.referrals.action": "Inviter des amis",

  // ---- Recent Activity ----
  "activity.title": "Activite recente",
  "activity.emptyTitle": "Aucune activite pour le moment",
  "activity.emptyBody":
    "Terminez votre premiere activite de gain et elle apparaitra ici.",
  "activity.colDescription": "Description",
  "activity.colSource": "Source",
  "activity.colDate": "Date",
  "activity.colReward": "Recompense",
  "activity.colStatus": "Statut",
  "activity.scrollHint": "Faites defiler pour voir plus",
  "activity.sourceSurvey": "Sondage",
  "activity.sourceOfferwall": "Mur d'offres",
  "activity.sourceAffiliate": "Affiliation",
  "activity.sourceReferral": "Parrainage",
  "activity.statusPending": "En attente",
  "activity.statusApproved": "Approuve",
  "activity.statusRejected": "Rejete",

  // ---- Referral summary ----
  "referral.title": "Programme de parrainage",
  "referral.desc":
    "Invitez des amis et gagnez eventuellement des recompenses de parrainage selon les regles de la plateforme une fois confirmees.",
  "referral.codeLabel": "Votre code de parrainage",
  "referral.codeUnavailable": "Code de parrainage indisponible",
  "referral.copy": "Copier le code",
  "referral.copied": "Copie",
  "referral.copyFailed": "La copie a echoue ; selectionnez et copiez manuellement.",
  "referral.friendsJoined": "Amis inscrits",
  "referral.rewardsPending": "Recompenses en attente",
  "referral.viewFull": "Voir le programme de parrainage",
  "referral.viewFullSoon": "Les details du parrainage apparaitront une fois disponibles.",

  // ---- Getting started ----
  "gettingStarted.title": "Pour commencer",
  "gettingStarted.step1": "Explorez les opportunites de gain disponibles.",
  "gettingStarted.step2": "Accomplissez une tache ou un sondage admissible.",
  "gettingStarted.step3": "Suivez le statut de vos recompenses gagnees.",
  "gettingStarted.step4": "Explorez les programmes d'affiliation ou le parrainage quand ils seront disponibles.",

  // ---- Login ----
  "login.metaTitle": "Connexion",
  "login.metaDescription": "Connectez-vous a votre compte TryQash.",
  "login.title": "Connexion",
  "login.description":
    "Utilisez votre e-mail ou votre nom d'utilisateur pour acceder a votre compte.",
  "login.identifierLabel":
    "E-mail ou nom d'utilisateur",
  "login.identifierPlaceholder": "vous@exemple.com",
  "login.passwordLabel": "Mot de passe",
  "login.passwordPlaceholder": "Votre mot de passe",
  "login.forgotLink": "Mot de passe oublie ?",
  "login.submit": "Se connecter",
  "login.footerPrompt": "Nouveau sur TryQash ?",
  "login.footerLink": "Creer un compte",

  // ---- Registration ----
  "register.metaTitle": "Creer un compte",
  "register.metaDescription": "Creez votre compte TryQash.",
  "register.title": "Creez votre compte",
  "register.description":
    "Inscrivez-vous avec votre e-mail, nom d'utilisateur, pays et mot de passe.",
  "register.emailLabel": "E-mail",
  "register.emailPlaceholder": "vous@exemple.com",
  "register.usernameLabel": "Nom d'utilisateur",
  "register.usernamePlaceholder": "ex. qash_user",
  "register.usernameHelper":
    "3 a 20 lettres, chiffres ou tirets bas.",
  "register.countryLabel": "Pays",
  "register.countryPlaceholder": "Selectionnez votre pays",
  "register.passwordLabel": "Mot de passe",
  "register.passwordPlaceholder": "Au moins 8 caracteres",
  "register.passwordHelper": "Regle provisoire : 8 caracteres minimum.",
  "register.confirmLabel": "Confirmez le mot de passe",
  "register.confirmPlaceholder": "Repetez votre mot de passe",
  "register.referralLabel": "Code de parrainage (facultatif)",
  "register.referralPlaceholder": "Code de la personne qui vous a parraine",
  "register.submit": "Creer un compte",
  "register.continueToSignIn": "Continuer vers la connexion",
  "register.footerPrompt": "Vous avez deja un compte ?",
  "register.footerLink": "Se connecter",

  // ---- Email verification ----
  "verifyEmail.metaTitle": "Verifiez votre e-mail",
  "verifyEmail.metaDescription":
    "Saisissez le code de verification envoye a votre adresse e-mail.",
  "verifyEmail.title": "Verifiez votre e-mail",
  "verifyEmail.description":
    "Nous avons envoye un code de verification a six chiffres a votre adresse e-mail. Saisissez-le ci-dessous pour continuer.",
  "verifyEmail.codeLabel": "Code de verification",
  "verifyEmail.digitLabel": "Chiffre {number} sur {total}",
  "verifyEmail.codeHelper": "Saisissez les six chiffres de votre e-mail.",
  "verifyEmail.codeIncomplete": "Saisissez les six chiffres du code.",
  "verifyEmail.submit": "Verifier l'e-mail",
  "verifyEmail.resend": "Renvoyer le code",
  "verifyEmail.resendIn": "Nouveau code dans {seconds}s",
  "verifyEmail.resendSent":
    "Un nouveau code a ete envoye a votre adresse e-mail.",
  "verifyEmail.wrongEmail": "Mauvaise adresse e-mail ?",
  "verifyEmail.registerAgain": "S'inscrire a nouveau",
  "verifyEmail.successTitle": "E-mail verifie",
  "verifyEmail.successBody":
    "Votre adresse e-mail a ete verifiee. Vous pouvez maintenant vous connecter.",
  "verifyEmail.continueToSignIn": "Continuer vers la connexion",
  "verifyEmail.expiredTitle": "Code expire",
  "verifyEmail.expiredBody":
    "Ce code de verification a expire. Demandez un nouveau code pour continuer.",
  "verifyEmail.requestNew": "Demander un nouveau code",
  "verifyEmail.errorNotConnected":
    "La verification par e-mail n'est pas encore connectee au backend. Ceci est un apercu de l'interface.",
  "verifyEmail.errorInvalidCode":
    "Ce code est incorrect. Verifiez-le et reessayez.",
  "verifyEmail.errorRateLimited":
    "Trop de tentatives. Veuillez patienter avant de reessayer.",
  "verifyEmail.errorUnknown":
    "Une erreur est survenue lors de la verification. Veuillez reessayer.",

  // ---- Forgot password ----
  "forgot.metaTitle": "Mot de passe oublie",
  "forgot.metaDescription":
    "Demandez les instructions de recuperation de mot de passe pour votre compte TryQash.",
  "forgot.title": "Mot de passe oublie",
  "forgot.description":
    "Saisissez l'e-mail de votre compte et nous vous enverrons les instructions de recuperation.",
  "forgot.emailLabel": "E-mail",
  "forgot.emailPlaceholder": "vous@exemple.com",
  "forgot.emailHelper":
    "Nous enverrons les instructions de recuperation a cette adresse.",
  "forgot.submit": "Envoyer l'e-mail de recuperation",
  "forgot.successTitle": "Consultez votre messagerie",
  "forgot.successBody":
    "Si un compte existe pour {email}, les instructions de recuperation sont en route. Suivez le lien de cet e-mail pour definir un nouveau mot de passe.",
  "forgot.backToSignIn": "Retour a la connexion",
  "forgot.footerPrompt": "Vous vous en souvenez finalement ?",

  // ---- Reset password ----
  "reset.metaTitle": "Definir un nouveau mot de passe",
  "reset.metaDescription":
    "Choisissez un nouveau mot de passe pour votre compte TryQash.",
  "reset.title": "Definir un nouveau mot de passe",
  "reset.description": "Choisissez un nouveau mot de passe pour votre compte.",
  "reset.checking": "Verification de votre lien...",
  "reset.invalidTitle": "Lien invalide ou expire",
  "reset.invalidBody":
    "Ce lien de reinitialisation est invalide ou a expire. Demandez un nouvel e-mail de recuperation pour continuer.",
  "reset.requestNew": "Demander un nouveau lien",
  "reset.successTitle": "Mot de passe mis a jour",
  "reset.successBody":
    "Votre mot de passe a ete modifie. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
  "reset.newPasswordLabel": "Nouveau mot de passe",
  "reset.newPasswordPlaceholder": "Au moins 8 caracteres",
  "reset.confirmLabel": "Confirmez le nouveau mot de passe",
  "reset.confirmPlaceholder": "Repetez votre nouveau mot de passe",
  "reset.submit": "Definir le mot de passe",
  "reset.footerPrompt": "Retour a la",
  "reset.footerLink": "connexion",

  // ---- Dashboard ----
  "dashboard.metaTitle": "Tableau de bord",
  "dashboard.metaDescription": "Votre tableau de bord TryQash.",
  "dashboard.title": "Tableau de bord",
  "dashboard.signedInAs": "Connecte en tant que {account}.",
  "dashboard.yourAccount": "votre compte",
  "dashboard.notConfiguredDescription":
    "L'authentification n'est pas configuree dans cet environnement.",
  "dashboard.signedInTitle": "Vous etes connecte",
  "dashboard.signedInBody":
    "L'authentification est active. Le contenu metier du tableau de bord arrivera lors de la prochaine etape.",
  "dashboard.notConfiguredTitle": "Authentification non configuree",
  "dashboard.notConfiguredBody":
    "Cette page est protegee des qu'un fournisseur est configure. Pour l'activer, creez un projet Supabase, definissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.local, puis redemarrez le serveur.",
  "dashboard.placeholderCard": "Carte provisoire",
  "dashboard.reserved": "Reserve a un contenu futur.",
  "dashboard.placeholderNote":
    "Contenu provisoire uniquement. Aucune donnee applicative n'existe encore.",

  // ---- Design preview (development page) ----
  "preview.topBar": "Apercu du design",
  "preview.eyebrow": "Systeme de design",
  "preview.title": "Apercu du systeme de design",
  "preview.description":
    "Structure applicative provisoire et composants partages suivant la reference visuelle approuvee. Cette page verifie les fondations avant la creation des ecrans reels.",
  "preview.bannerTitle": "Apercu de developpement uniquement",
  "preview.bannerBody":
    "La mise en page, les libelles de navigation et tout le contenu affiche ici sont provisoires et servent a la verification visuelle - ce ne sont ni des fonctionnalites ni des donnees TryQash confirmees.",
  "preview.primaryAction": "Action principale",
  "preview.secondaryAction": "Action secondaire",
  "preview.cardsTitle": "Cartes",
  "preview.cardsNote":
    "Surfaces gris clair avec bordures discretes, selon la reference. Les zones de contenu sont provisoires.",
  "preview.formsTitle": "Boutons et champs",
  "preview.formsNote":
    "Styles de controles compacts : bouton principal noir, bouton secondaire borde, champs avec libelles.",
  "preview.buttonsTitle": "Boutons",
  "preview.buttonsNote": "Variantes, etats et tailles.",
  "preview.inputsTitle": "Champs",
  "preview.inputsNote":
    "Libelles, textes d'aide, validation et etats. Les noms de champs sont des exemples.",
  "preview.variants": "Variantes",
  "preview.states": "Etats",
  "preview.sizes": "Tailles",
  "preview.processing": "Traitement",
  "preview.primaryDisabled": "Principal desactive",
  "preview.secondaryDisabled": "Secondaire desactive",
  "preview.small": "Petit",
  "preview.medium": "Moyen",
  "preview.large": "Grand",
  "preview.sampleLabel": "Libelle d'exemple",
  "preview.samplePlaceholder": "Texte provisoire",
  "preview.sampleHelper": "Le texte d'aide ajoute du contexte sous le champ.",
  "preview.invalidSample": "Exemple invalide",
  "preview.sampleValue": "Valeur d'exemple",
  "preview.sampleValidation": "Ceci est un message de validation d'exemple.",
  "preview.disabledSample": "Exemple desactive",
  "preview.disabledPlaceholder": "Champ desactive",
  "preview.statusTitle": "Indicateurs d'etat",
  "preview.statusNote":
    "Vert pour les etats positifs, rouge pour les negatifs, ambre pour l'attention, gris pour le neutre.",
  "preview.positive": "Positif",
  "preview.attention": "Attention",
  "preview.negative": "Negatif",
  "preview.neutral": "Neutre",
  "preview.notificationsTitle": "Tons des notifications",
  "preview.notificationsNote":
    "La banniere d'information par defaut utilise un gris neutre ; les bannieres d'etat utilisent les couleurs semantiques.",
  "preview.information": "Information",
  "preview.informationBody":
    "Les avis neutres apparaissent dans ce ton gris discret.",
  "preview.warning": "Avertissement",
  "preview.warningBody":
    "Les situations necessitant une attention utiliseraient ce ton ambre.",
  "preview.error": "Erreur",
  "preview.errorBody":
    "Les echecs seraient signales dans ce ton rouge avec des conseils de resolution.",
  "preview.tableTitle": "Tableau",
  "preview.tableNote":
    "En-tetes discrets en majuscules et separateurs de lignes pour un contenu tabulaire lisible.",
  "preview.tableItem": "Element",
  "preview.tableStatus": "Etat",
  "preview.tableNoteColumn": "Note",
  "preview.tableRow": "Ligne d'exemple {number}",
  "preview.tablePlaceholder": "Texte provisoire",
  "preview.idle": "Inactif",
  "preview.tableFooter":
    "Lignes provisoires - aucune donnee reelle TryQash n'est affichee.",
  "preview.placeholderCard": "Carte provisoire",
  "preview.reserved": "Reserve a un contenu futur.",
  "preview.endNote":
    "Fin de l'apercu. Les libelles de navigation et tout le contenu de cette page sont provisoires et servent uniquement a la verification visuelle.",

  "preview.loadingTitle": "Etats de chargement",
  "preview.loadingNote":
    "Anneaux rotatifs pour les actions, blocs squelettes pour le contenu en cours de chargement.",
  "preview.spinnersLabel": "Indicateurs rotatifs",
  "preview.skeletonsLabel": "Squelettes",
  "preview.buttonLoadingLabel": "Boutons en chargement",
  "preview.saving": "Enregistrement",
  "preview.loadingExample": "Exemple de chargement",

  // ---- Validation ----
  "validation.email.required": "Saisissez votre adresse e-mail.",
  "validation.email.invalid": "Saisissez une adresse e-mail valide.",
  "validation.password.required": "Saisissez un mot de passe.",
  "validation.password.tooShort": "Utilisez au moins {min} caracteres.",
  "validation.password.enterYours": "Saisissez votre mot de passe.",
  "validation.confirm.required": "Confirmez votre mot de passe.",
  "validation.confirm.mismatch": "Les mots de passe ne correspondent pas.",
  "validation.username.required": "Choisissez un nom d'utilisateur.",
  "validation.username.invalid":
    "Utilisez 3 a 20 lettres, chiffres ou tirets bas.",
  "validation.country.required": "Selectionnez votre pays.",
  "validation.country.invalid": "Le pays doit etre un code a deux lettres.",
  "validation.identifier.required":
    "Saisissez votre e-mail ou nom d'utilisateur.",

  // ---- Authentication errors ----
  "error.notConfigured":
    "L'authentification n'est pas encore configuree dans cet environnement. Definissez les variables Supabase dans .env.local pour activer la connexion.",
  "error.connection":
    "Impossible de joindre le service d'authentification. Verifiez votre connexion et reessayez.",
  "error.invalidCredentials":
    "Identifiants invalides. Verifiez vos informations et reessayez.",
  "error.identifierLoginUnavailable":
    "La connexion avec un nom d'utilisateur n'est pas encore activee cote backend. Utilisez votre adresse e-mail ou contactez l'assistance.",
  "error.usernameTaken":
    "Ce nom d'utilisateur est deja pris. Veuillez en choisir un autre.",
  "error.emailTaken":
    "Un compte existe deja avec cet e-mail. Essayez de vous connecter.",
  "error.referralInvalid":
    "Ce code de parrainage n'a pas pu etre accepte. Verifiez-le ou laissez le champ vide.",
};

export const DICTIONARIES: Record<Locale, Record<TranslationKey, string>> = {
  en,
  fr,
};

/**
 * Looks up a key and replaces {placeholders} with the provided values.
 * Unknown keys fall back to the key itself so missing text is obvious.
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  values?: Record<string, string | number>,
): string {
  const template = DICTIONARIES[locale][key] ?? key;
  if (!values) {
    return template;
  }
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}
