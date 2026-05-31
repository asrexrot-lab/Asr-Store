import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    updateProfile, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getDatabase, ref, set, get, update, push, onValue, child
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCr4u0pCxacz2OuZCLxA5uk2nL-VIYbcd8",
  authDomain: "asr-shop-f4981.firebaseapp.com",
  projectId: "asr-shop-f4981",
  storageBucket: "asr-shop-f4981.firebasestorage.app",
  messagingSenderId: "1032294583627",
  appId: "1:1032294583627:web:7eb0933e8525047e6a6cce",
  measurementId: "G-QV11SJD9NE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Global View Screen Elements Registry
const screens = {
    auth: document.getElementById('authScreen'),
    dashboard: document.getElementById('dashboardScreen'),
    addMoney: document.getElementById('addMoneyScreen'),
    referral: document.getElementById('referralSystemScreen'),
    admin: document.getElementById('adminPanelScreen')
};

function navigateToScreen(targetScreenKey) {
    Object.keys(screens).forEach(key => {
        if (key === targetScreenKey) {
            screens[key].classList.remove('view-hidden');
            screens[key].classList.add('view-active');
        } else {
            screens[key].classList.remove('view-active');
            screens[key].classList.add('view-hidden');
        }
    });
}

// Global System Variables Reference
let activeSupportChannelUrl = "https://t.me/default_support";
let targetedActiveNoticeUrl = "";
let operationalFormAuthMode = 'SIGN_IN';
let localActiveServicesMemory = {};
let systemGlobalMinDepositLimit = 20; // Structural Dynamic Default Configuration
const CRITICAL_ADMIN_EMAIL = "jihad@admin.com";

// DOM Reference Mapping Framework
const globalNoticeModal = document.getElementById('globalNoticeModal');
const closeNoticeModalBtn = document.getElementById('closeNoticeModalBtn');
const noticeDynamicTextContent = document.getElementById('noticeDynamicTextContent');
const noticeInteractiveBodyClick = document.getElementById('noticeInteractiveBodyClick');

// Platform Output Dynamic Labels
const walletDisplayBkash = document.getElementById('walletDisplayBkash');
const walletDisplayNagad = document.getElementById('walletDisplayNagad');
const walletDisplayRocket = document.getElementById('walletDisplayRocket');
const depositAmountInput = document.getElementById('depositAmountInput');

// Auth Form Registry
const coreAuthForm = document.getElementById('coreAuthForm');
const inputNodeUsername = document.getElementById('inputNodeUsername');
const inputNodeReferral = document.getElementById('inputNodeReferral');
const fieldUsername = document.getElementById('fieldUsername');
const fieldEmail = document.getElementById('fieldEmail');
const fieldPassword = document.getElementById('fieldPassword');
const fieldReferralInput = document.getElementById('fieldReferralInput');
const engineSubmitBtn = document.getElementById('engineSubmitBtn');
const triggerSignIn = document.getElementById('triggerSignIn');
const triggerSignUp = document.getElementById('triggerSignUp');

// SMM Execution Nodes
const orderCategorySelector = document.getElementById('orderCategorySelector');
const orderVolumeQuantityInput = document.getElementById('orderVolumeQuantityInput');
const invoiceRatePerThousand = document.getElementById('invoiceRatePerThousand');
const invoiceComputedNetCost = document.getElementById('invoiceComputedNetCost');
const smmExecutionForm = document.getElementById('smmExecutionForm');

// Admin Inputs
const adminSwitchServerStatus = document.getElementById('adminSwitchServerStatus');
const adminActiveServicesContainer = document.getElementById('adminActiveServicesContainer');
const adminDepositRequestsContainer = document.getElementById('adminDepositRequestsContainer');
const adminMasterOrdersTableContainer = document.getElementById('adminMasterOrdersTableContainer');
const adminNoticeControlForm = document.getElementById('adminNoticeControlForm');
const adminPlatformGatewaysForm = document.getElementById('adminPlatformGatewaysForm');

// --- NAVIGATION ACTIONS HOOKS ---
document.getElementById('navToAddMoneyBtn').addEventListener('click', () => navigateToScreen('addMoney'));
document.getElementById('navToReferralTrackerBtn').addEventListener('click', () => navigateToScreen('referral'));
document.querySelectorAll('.backToDashboard').forEach(btn => {
    btn.addEventListener('click', () => navigateToScreen('dashboard'));
});

// Dynamic Support Link Binding
document.getElementById('userTriggerSupportLinkBtn').addEventListener('click', () => {
    window.open(activeSupportChannelUrl, '_blank');
});

// Clipboard Helper
function bindClickToCopyElement(element) {
    element.addEventListener('click', () => {
        if(element.innerText !== "Loading..." && element.innerText !== "Not Set") {
            navigator.clipboard.writeText(element.innerText).then(() => alert("Copied to clipboard: " + element.innerText));
        }
    });
}
bindClickToCopyElement(walletDisplayBkash);
bindClickToCopyElement(walletDisplayNagad);
bindClickToCopyElement(walletDisplayRocket);

// --- AUTH ROUTER SWITCHING EFFECT ---
function switchAuthMode(targetMode) {
    operationalFormAuthMode = targetMode;
    if (operationalFormAuthMode === 'SIGN_UP') {
        triggerSignUp.classList.add('target-active');
        triggerSignIn.classList.remove('target-active');
        engineSubmitBtn.innerHTML = '<span>Register Account</span> <i class="fa-solid fa-user-plus"></i>';
        inputNodeUsername.style.display = 'block'; inputNodeReferral.style.display = 'block';
        setTimeout(() => { 
            inputNodeUsername.style.opacity = '1'; inputNodeUsername.style.maxHeight = '100px'; inputNodeUsername.style.marginBottom = '16px';
            inputNodeReferral.style.opacity = '1'; inputNodeReferral.style.maxHeight = '100px'; inputNodeReferral.style.marginBottom = '16px';
        }, 10);
        fieldUsername.required = true;
    } else {
        triggerSignIn.classList.add('target-active');
        triggerSignUp.classList.remove('target-active');
        engineSubmitBtn.innerHTML = '<span>Log In Now</span> <i class="fa-solid fa-arrow-right"></i>';
        inputNodeUsername.style.opacity = '0'; inputNodeUsername.style.maxHeight = '0px';
        inputNodeReferral.style.opacity = '0'; inputNodeReferral.style.maxHeight = '0px';
        setTimeout(() => { inputNodeUsername.style.display = 'none'; inputNodeReferral.style.display = 'none'; }, 300);
        fieldUsername.required = false;
    }
}
triggerSignIn.addEventListener('click', () => switchAuthMode('SIGN_IN'));
triggerSignUp.addEventListener('click', () => switchAuthMode('SIGN_UP'));

// --- INVOICE COMPUTATION ALGORITHM ---
function recomputeInvoicePricing() {
    const activeSelectedId = orderCategorySelector.value;
    if (!activeSelectedId || !localActiveServicesMemory[activeSelectedId]) return;
    const unitRate = parseFloat(localActiveServicesMemory[activeSelectedId].rate) || 0;
    const specifiedQty = parseInt(orderVolumeQuantityInput.value) || 0;
    invoiceRatePerThousand.innerText = `${unitRate} tk`;
    invoiceComputedNetCost.innerText = `${((specifiedQty / 1000) * unitRate).toFixed(2)} tk`;
}
orderCategorySelector.addEventListener('change', recomputeInvoicePricing);
orderVolumeQuantityInput.addEventListener('input', recomputeInvoicePricing);

// --- AUTH DATA ROUTING MANAGEMENT ---
coreAuthForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = fieldEmail.value.trim();
    const password = fieldPassword.value;
    engineSubmitBtn.disabled = true;

    if (operationalFormAuthMode === 'SIGN_IN') {
        signInWithEmailAndPassword(auth, email, password).then((credential) => {
            if (credential.user.email !== CRITICAL_ADMIN_EMAIL) {
                get(ref(db, `users/${credential.user.uid}`)).then((snap) => {
                    if (snap.exists() && snap.val().isBanned === true) {
                        alert("Account Suspended."); signOut(auth);
                    }
                });
            }
        }).catch(err => { alert(err.message); engineSubmitBtn.disabled = false; });
    } else {
        const username = fieldUsername.value.trim();
        const introducedBy = fieldReferralInput.value.trim();
        
        createUserWithEmailAndPassword(auth, email, password).then((credential) => {
            updateProfile(credential.user, { displayName: username });
            set(ref(db, `users/${credential.user.uid}`), {
                username: username, email: email, balance: 0, totalSpent: 0, isBanned: false,
                referredBy: introducedBy || null
            });
        }).catch(err => { alert(err.message); engineSubmitBtn.disabled = false; });
    }
});

document.getElementById('providerNodeGoogle').addEventListener('click', () => {
    signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
        const userRef = ref(db, `users/${result.user.uid}`);
        get(userRef).then((snapshot) => {
            if (!snapshot.exists()) {
                set(userRef, { username: result.user.displayName, email: result.user.email, balance: 0, totalSpent: 0, isBanned: false, referredBy: null });
            }
        });
    }).catch(err => alert(err.message));
});

document.getElementById('actionTriggerLogout').addEventListener('click', () => signOut(auth));
document.getElementById('actionAdminLogout').addEventListener('click', () => signOut(auth));

// --- ISOLATED DEPOSIT SUBMISSION HANDLER ---
document.getElementById('addMoneyRequestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedMethod = document.getElementById('depositMethodSelector').value;
    const amount = parseFloat(depositAmountInput.value);
    const txnId = document.getElementById('depositTxnInput').value.trim();
    const activeUser = auth.currentUser;
    if (!activeUser) return;
    
    // Security Runtime Verification to matching Admin Panel Dynamic Limit
    if (amount < systemGlobalMinDepositLimit) {
        alert(`Minimum Add Money restriction active. Min allowance: ${systemGlobalMinDepositLimit} tk`);
        return;
    }
    
    const requestKey = push(child(ref(db), 'depositRequests')).key;
    set(ref(db, `depositRequests/${requestKey}`), {
        uid: activeUser.uid, email: activeUser.email, amount: amount, txnId: txnId, method: selectedMethod, status: "PENDING"
    }).then(() => {
        alert("Payment verification filed for administration review workflow.");
        document.getElementById('addMoneyRequestForm').reset();
        navigateToScreen('dashboard');
    });
});

// --- PLATFORM NOTICE MODAL MANAGEMENT ---
closeNoticeModalBtn.addEventListener('click', () => {
    globalNoticeModal.classList.add('modal-hidden');
});
noticeInteractiveBodyClick.addEventListener('click', () => {
    if (targetedActiveNoticeUrl) window.open(targetedActiveNoticeUrl, '_blank');
});

function monitorLivePlatformNotice() {
    onValue(ref(db, 'systemSettings/liveNotice'), (snap) => {
        if (snap.exists() && auth.currentUser && auth.currentUser.email !== CRITICAL_ADMIN_EMAIL) {
            const data = snap.val();
            noticeDynamicTextContent.innerText = data.text;
            targetedActiveNoticeUrl = data.url;
            globalNoticeModal.classList.remove('modal-hidden');
        }
    });
}

// --- ORDER EXECUTION HANDLER ---
smmExecutionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const serviceId = orderCategorySelector.value;
    const targetLink = orderTargetLinkInput.value.trim();
    const volumeQty = parseInt(orderVolumeQuantityInput.value);
    const activeUser = auth.currentUser;
    if (!activeUser || !serviceId) return;

    const rate = localActiveServicesMemory[serviceId].rate;
    const computationalCost = (volumeQty / 1000) * rate;

    get(ref(db, `users/${activeUser.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.balance < computationalCost) return alert("Insufficient wallet funds.");

            update(ref(db, `users/${activeUser.uid}`), {
                balance: userData.balance - computationalCost,
                totalSpent: (userData.totalSpent || 0) + computationalCost
            });
            
            const orderKey = push(child(ref(db), 'orders')).key;
            set(ref(db, `orders/${orderKey}`), {
                uid: activeUser.uid, email: activeUser.email, serviceName: localActiveServicesMemory[serviceId].name,
                link: targetLink, quantity: volumeQty, cost: computationalCost, status: "PENDING"
            }).then(() => { alert("Order logged!"); smmExecutionForm.reset(); recomputeInvoicePricing(); });
        }
    });
});

// --- ADMIN CONTROL MANAGEMENT FORMS ---
adminNoticeControlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('adminNoticeText').value.trim();
    const url = document.getElementById('adminNoticeLink').value.trim();
    set(ref(db, 'systemSettings/liveNotice'), { text: text, url: url }).then(() => {
        alert("Live dynamic advertisement popup update pushed!");
        adminNoticeControlForm.reset();
    });
});

adminPlatformGatewaysForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bkash = document.getElementById('adminInputBkash').value.trim();
    const nagad = document.getElementById('adminInputNagad').value.trim();
    const rocket = document.getElementById('adminInputRocket').value.trim();
    const minDeposit = parseInt(document.getElementById('adminInputMinDeposit').value) || 20; // Fallback configuration 20
    const support = document.getElementById('adminInputSupportLink').value.trim();

    set(ref(db, 'systemSettings/gateways'), {
        bkash: bkash, nagad: nagad, rocket: rocket, minDeposit: minDeposit, supportLink: support
    }).then(() => alert("Gateway and minimum structural deposit limit configs synced."));
});

document.getElementById('adminAddServiceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('adminServiceName').value.trim();
    const rate = parseFloat(document.getElementById('adminServiceRate').value);
    const key = push(child(ref(db), 'services')).key;
    set(ref(db, `services/${key}`), { name: name, rate: rate }).then(() => document.getElementById('adminAddServiceForm').reset());
});

adminSwitchServerStatus.addEventListener('change', () => {
    set(ref(db, 'systemSettings/isServerOnline'), adminSwitchServerStatus.checked);
});

function modifyUserAccountStatus(isBanOperation, grantBonusAmt = 0) {
    const email = document.getElementById('adminUserSearchEmail').value.trim();
    if (!email) return alert("Specify target email.");
    get(ref(db, 'users')).then((snap) => {
        if (snap.exists()) {
            let matchedKey = null;
            Object.entries(snap.val()).forEach(([k, v]) => { if (v.email === email) matchedKey = k; });
            if (!matchedKey) return alert("Identity parameters missing.");

            if (isBanOperation !== null) {
                update(ref(db, `users/${matchedKey}`), { isBanned: isBanOperation }).then(() => alert("Restriction modified."));
            } else if (grantBonusAmt > 0) {
                update(ref(db, `users/${matchedKey}`), { balance: (snap.val()[matchedKey].balance || 0) + grantBonusAmt }).then(() => alert("Bonus credited."));
            }
        }
    });
}
document.getElementById('adminBtnBanUser').addEventListener('click', () => modifyUserAccountStatus(true));
document.getElementById('adminBtnUnbanUser').addEventListener('click', () => modifyUserAccountStatus(false));
document.getElementById('adminBtnGrantBonus').addEventListener('click', () => {
    const bonus = parseFloat(document.getElementById('adminBonusAmountInput').value) || 0;
    modifyUserAccountStatus(null, bonus);
});

// --- SUBSCRIPTIONS WITH STRUCTURAL REFERRAL BONUS RULES ---
function initializeSystemRealtimeSubscriptions() {
    // Dynamic Monitor Gateways Configurations Pipeline
    onValue(ref(db, 'systemSettings/gateways'), (snap) => {
        if(snap.exists()){
            const data = snap.val();
            activeSupportChannelUrl = data.supportLink || "https://t.me/default_support";
            walletDisplayBkash.innerText = data.bkash || "Not Set";
            walletDisplayNagad.innerText = data.nagad || "Not Set";
            walletDisplayRocket.innerText = data.rocket || "Not Set";
            
            // Dynamic Synchronization for Minimum Add Money Limits Runtime Assignment
            systemGlobalMinDepositLimit = data.minDeposit !== undefined ? parseInt(data.minDeposit) : 20;
            depositAmountInput.placeholder = `Min ${systemGlobalMinDepositLimit} tk`;
            depositAmountInput.min = systemGlobalMinDepositLimit;
            
            // Auto Populate fields for admin editing ease
            if(auth.currentUser && auth.currentUser.email === CRITICAL_ADMIN_EMAIL) {
                document.getElementById('adminInputBkash').value = data.bkash || "";
                document.getElementById('adminInputNagad').value = data.nagad || "";
                document.getElementById('adminInputRocket').value = data.rocket || "";
                document.getElementById('adminInputMinDeposit').value = systemGlobalMinDepositLimit;
                document.getElementById('adminInputSupportLink').value = data.supportLink || "";
            }
        } else {
            // Seeding safe default states into fallback parameters mapping node
            systemGlobalMinDepositLimit = 20;
            depositAmountInput.placeholder = "Min 20 tk";
            depositAmountInput.min = 20;
        }
    });

    onValue(ref(db, 'services'), (snap) => {
        orderCategorySelector.innerHTML = ""; adminActiveServicesContainer.innerHTML = "";
        localActiveServicesMemory = snap.val() || {};
        Object.entries(localActiveServicesMemory).forEach(([id, data]) => {
            const opt = document.createElement('option'); opt.value = id; opt.innerText = `${data.name} - ${data.rate} tk/1K`;
            orderCategorySelector.appendChild(opt);
            const li = document.createElement('li');
            li.innerHTML = `<span>${data.name} (${data.rate} tk)</span><div class="stream-item-buttons"><button class="stream-action-btn btn-reject delete-srv-btn" data-id="${id}">Remove</button></div>`;
            adminActiveServicesContainer.appendChild(li);
        });
        document.querySelectorAll('.delete-srv-btn').forEach(b => b.addEventListener('click', (e) => set(ref(db, `services/${e.target.getAttribute('data-id')}`), null)));
        recomputeInvoicePricing();
    });

    onValue(ref(db, 'depositRequests'), (snap) => {
        adminDepositRequestsContainer.innerHTML = ""; if (!snap.exists()) return;
        Object.entries(snap.val()).forEach(([reqId, payload]) => {
            if (payload.status === "PENDING") {
                const li = document.createElement('li');
                li.innerHTML = `<div><strong>${payload.email}</strong><br>Amount: ${payload.amount} tk | [${payload.method || 'bKash'}] Txn: ${payload.txnId}</div>
                    <div class="stream-item-buttons">
                        <button class="stream-action-btn btn-approve approve-dep-btn" data-id="${reqId}" data-uid="${payload.uid}" data-amt="${payload.amount}">Approve</button>
                        <button class="stream-action-btn btn-reject reject-dep-btn" data-id="${reqId}">Cancel</button>
                    </div>`;
                adminDepositRequestsContainer.appendChild(li);
            }
        });

        document.querySelectorAll('.approve-dep-btn').forEach(b => b.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const targetUid = e.target.getAttribute('data-uid');
            const amt = parseFloat(e.target.getAttribute('data-amt'));

            get(ref(db, `users/${targetUid}`)).then((userSnap) => {
                if (userSnap.exists()) {
                    const profileData = userSnap.val();
                    update(ref(db, `users/${targetUid}`), { balance: (profileData.balance || 0) + amt });
                    update(ref(db, `depositRequests/${id}`), { status: "APPROVED" });

                    // Execute Network Commission Loop (2% Parameter Pipeline Rule Setup)
                    if (profileData.referredBy) {
                        const code = profileData.referredBy;
                        get(ref(db, `users/${code}`)).then((refSnap) => {
                            if (refSnap.exists()) {
                                const allocation = amt * 0.02;
                                update(ref(db, `users/${code}`), { balance: (refSnap.val().balance || 0) + allocation });
                            }
                        });
                    }
                }
            });
        }));
        document.querySelectorAll('.reject-dep-btn').forEach(b => b.addEventListener('click', (e) => update(ref(db, `depositRequests/${e.target.getAttribute('data-id')}`), { status: "REJECTED" })));
    });

    onValue(ref(db, 'orders'), (snap) => {
        adminMasterOrdersTableContainer.innerHTML = ""; if (!snap.exists()) return;
        Object.entries(snap.val()).forEach(([orderId, data]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${data.email}</td><td>${data.serviceName}</td><td><span class="copyable-link-node" data-raw-url="${data.link}">${data.link}</span></td><td>${data.quantity}</td><td><span style="color:#f1c40f;font-weight:600;">${data.status}</span></td>`;
            adminMasterOrdersTableContainer.appendChild(tr);
        });
        document.querySelectorAll('.copyable-link-node').forEach(n => n.addEventListener('click', (e) => {
            navigator.clipboard.writeText(e.target.getAttribute('data-raw-url')).then(() => alert("Copied link parameter."));
        }));
    });
}

// --- APP LIFECYCLE ROUTER HANDLER ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email === CRITICAL_ADMIN_EMAIL) {
            navigateToScreen('admin');
            get(ref(db, 'systemSettings/isServerOnline')).then((snap) => { adminSwitchServerStatus.checked = snap.exists() ? snap.val() : true; });
            initializeSystemRealtimeSubscriptions();
        } else {
            onValue(ref(db, 'systemSettings/isServerOnline'), (snap) => {
                if (!(snap.exists() ? snap.val() : true)) { alert("Engine Offline."); signOut(auth); return; }
                navigateToScreen('dashboard');
                
                document.getElementById('referralTrackingCodeDisplayNode').innerText = user.uid;
                document.getElementById('copyReferralUidBtn').onclick = () => {
                    navigator.clipboard.writeText(user.uid).then(() => alert("Referral ID Code copied to clipboard context allocation."));
                };

                onValue(ref(db, `users/${user.uid}`), (userSnapshot) => {
                    if (userSnapshot.exists() && userSnapshot.val().isBanned) { alert("Banned Account."); signOut(auth); return; }
                    if (userSnapshot.exists()) {
                        const d = userSnapshot.val();
                        document.getElementById('userInitialNode').innerText = d.username ? d.username.charAt(0).toUpperCase() : 'U';
                        document.getElementById('userProfileGreetingName').innerText = d.username || user.email;
                        document.getElementById('dashboardBalanceNode').innerText = parseFloat(d.balance).toFixed(2);
                        document.getElementById('dashboardSpentNode').innerText = `${parseFloat(d.totalSpent || 0).toFixed(2)} tk`;
                    }
                });
                initializeSystemRealtimeSubscriptions();
                monitorLivePlatformNotice();
            });
        }
    } else {
        navigateToScreen('auth');
        switchAuthMode('SIGN_IN');
    }
});
