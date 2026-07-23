const SUPABASE_URL = 'https://aweqbxyjeohsnevnkwor.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1tMcgJ9Gv5vfi-pKrPqOTA_BdhZqPoM';

const DISTRICT_MAP = {
    '香港島': ['中西區', '灣仔區', '東區', '南區'],
    '九龍': ['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'],
    '新界': ['葵青區', '荃灣區', '屯門區', '元朗區', '北區', '大埔區', '沙田區', '西貢區'],
    '離島': ['離島區'],
    '線上': ['💻 線上補習']
};

const GRADE_OPTIONS = {
    '幼稚園': ['K1', 'K2', 'K3'],
    '小學': ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    '中學': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
    '其他': ['大專', '大學', '成人']
};

const GRADE_SUBJECTS_MAP = {
    'K1': ['中文', '英文', '數學'],
    'K2': ['中文', '英文', '數學'],
    'K3': ['中文', '英文', '數學'],
    'P1': ['中文', '英文', '數學', '常識'],
    'P2': ['中文', '英文', '數學', '常識'],
    'P3': ['中文', '英文', '數學', '常識'],
    'P4': ['中文', '英文', '數學', '常識'],
    'P5': ['中文', '英文', '數學', '常識'],
    'P6': ['中文', '英文', '數學', '常識'],
    'F1': ['中文', '英文', '數學', '公民與社會發展', '中國文學', '英語文學', '中國歷史', '歷史', '地理', '經濟', '企業、會計與財務概論', '生物', '化學', '物理', '倫理與宗教', '旅遊與款待', '設計與應用科技', '健康管理與社會關懷', '資訊及通訊科技', '科技與生活', '音樂', '視覺藝術', '體育'],
    'F2': ['中文', '英文', '數學', '公民與社會發展', '中國文學', '英語文學', '中國歷史', '歷史', '地理', '經濟', '企業、會計與財務概論', '生物', '化學', '物理', '倫理與宗教', '旅遊與款待', '設計與應用科技', '健康管理與社會關懷', '資訊及通訊科技', '科技與生活', '音樂', '視覺藝術', '體育'],
    'F3': ['中文', '英文', '數學', '公民與社會發展', '中國文學', '英語文學', '中國歷史', '歷史', '地理', '經濟', '企業、會計與財務概論', '生物', '化學', '物理', '倫理與宗教', '旅遊與款待', '設計與應用科技', '健康管理與社會關懷', '資訊及通訊科技', '科技與生活', '音樂', '視覺藝術', '體育'],
    'F4': ['中文', '英文', '數學', '公民與社會發展', '中國文學', '英語文學', '中國歷史', '歷史', '地理', '經濟', '企業、會計與財務概論', '生物', '化學', '物理', '倫理與宗教', '旅遊與款待', '設計與應用科技', '健康管理與社會關懷', '資訊及通訊科技', '科技與生活', '音樂', '視覺藝術', '體育'],
    'F5': ['中文', '英文', '數學', '公民與社會發展', '中國文學', '英語文學', '中國歷史', '歷史', '地理', '經濟', '企業、會計與財務概論', '生物', '化學', '物理', '倫理與宗教', '旅遊與款待', '設計與應用科技', '健康管理與社會關懷', '資訊及通訊科技', '科技與生活', '音樂', '視覺藝術', '體育'],
    'F6': ['中文', '英文', '數學', '公民與社會發展', '中國文學', '英語文學', '中國歷史', '歷史', '地理', '經濟', '企業、會計與財務概論', '生物', '化學', '物理', '倫理與宗教', '旅遊與款待', '設計與應用科技', '健康管理與社會關懷', '資訊及通訊科技', '科技與生活', '音樂', '視覺藝術', '體育'],
    '大專': ['自訂科目'],
    '大學': ['自訂科目'],
    '成人': ['自訂科目']
};

let supabase = null;
let currentUser = null;
let currentProfile = null;
let currentTutorProfile = null;
let selectedPostId = null;
let selectedTutorId = null;
let selectedPostType = 'tutor_wanted';
let selectedRating = 0;
let reportTarget = null;
let selectedReview = null;
let currentTabType = 'tutor_wanted';
let postToDelete = null;
let isEditingProfile = false;
let isEditingTutorProfile = false;
let selectedTutorGrades = [];
let selectedTutorSubjects = [];
let tutorOtherSubjectText = '';
let selectedPostDistricts = [];
let isAuthReady = false;

// 从localStorage恢复状态
function restoreAuthStateFromStorage() {
    try {
        const storedProfile = localStorage.getItem('tutorbridge_profile');
        const storedTutorProfile = localStorage.getItem('tutorbridge_tutor_profile');
        if (storedProfile) {
                    currentProfile = JSON.parse(storedProfile);
                    if (storedTutorProfile) {
                        currentTutorProfile = JSON.parse(storedTutorProfile);
                    }
                    console.log('✅ 从localStorage恢复用户状态:', currentProfile);
                    return true;
        }
    } catch (e) {
        console.error('❌ 从localStorage恢复状态失败:', e);
    }
    return false;
}

// 保存状态到localStorage
function saveAuthStateToStorage() {
    try {
        if (currentProfile) {
            localStorage.setItem('tutorbridge_profile', JSON.stringify(currentProfile));
            if (currentTutorProfile) {
                localStorage.setItem('tutorbridge_tutor_profile', JSON.stringify(currentTutorProfile));
            }
            console.log('✅ 保存用户状态到localStorage');
        } else {
            localStorage.removeItem('tutorbridge_profile');
            localStorage.removeItem('tutorbridge_tutor_profile');
        }
    } catch (e) {
        console.error('❌ 保存状态到localStorage失败:', e);
    }
}

// 初始化supabase
function initSupabase() {
    console.log('🚀 initSupabase 開始執行');
    try {
        if (typeof window.supabase === 'undefined') {
            const errorMsg = 'Supabase SDK 未載入，請檢查 CDN 連結';
            console.error('❌', errorMsg);
            showToast(errorMsg, 'error');
            return;
        }

        console.log('🔗 SUPABASE_URL:', SUPABASE_URL);
        console.log('🔑 SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '(已設定)' : '(未設定)');
        
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 已初始化');
        
        checkAuth();
    } catch (error) {
        console.error('❌ 初始化 Supabase 失敗:', error);
        console.error('❌ 錯誤詳情:', error.message);
        showToast(`初始化失敗：${error.message}，請檢查網路連線或 Supabase 配置`, 'error');
    }
}

async function checkAuth() {
    console.log('🔐 checkAuth 開始');
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            console.log('✅ 找到現有 session');
            currentUser = session.user;
            await loadProfile(currentUser.id);
            
            if (currentProfile) {
                if (currentProfile.role === 'student') {
                    currentTabType = 'tutor_wanted';
                } else if (currentProfile.role === 'tutor') {
                    currentTabType = 'student_wanted';
                }
                console.log('🎯 設定預設頁籤:', currentTabType);
            }
            saveAuthStateToStorage();
        } else {
            console.log('⚠️ 沒有找到 session');
            currentUser = null;
            currentProfile = null;
            currentTutorProfile = null;
            saveAuthStateToStorage();
            currentTabType = 'tutor_wanted';
        }
    } catch (error) {
        console.error('❌ checkAuth 錯誤:', error);
    }
    
    isAuthReady = true;
    updateAuthUI();
    
    console.log('🔗 設定 onAuthStateChange 監聽');
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('📡 onAuthStateChange 事件:', event);
        if (session) {
            console.log('✅ 新 session 建立');
            currentUser = session.user;
            await loadProfile(currentUser.id);
            
            if (currentProfile) {
                if (currentProfile.role === 'student') {
                    currentTabType = 'tutor_wanted';
                } else if (currentProfile.role === 'tutor') {
                    currentTabType = 'student_wanted';
                }
                console.log('🎯 設定預設頁籤:', currentTabType);
            }
            saveAuthStateToStorage();
        } else {
            console.log('🚫 session 結束');
            currentUser = null;
            currentProfile = null;
            currentTutorProfile = null;
            saveAuthStateToStorage();
        }
        updateAuthUI();
    });
}

async function loadProfile(userId) {
    console.log('📥 loadProfile 開始，userId:', userId);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('❌ 載入 profiles 失敗:', error);
            throw error;
        }
        currentProfile = data;
        console.log('✅ profiles 載入成功:', currentProfile);
        
        if (currentProfile && !currentProfile.user_code && currentProfile.role) {
            console.log('🔢 開始生成 user_code...');
            try {
                await generateAndSetUserCode(currentProfile.role);
            } catch (userCodeError) {
                console.error('❌ 生成 user_code 失敗:', userCodeError);
            }
        }
        
        if (data.role === 'tutor') {
            console.log('👨‍🏫 載入 tutor_profiles...');
            const { data: tutorData, error: tutorError } = await supabase
                .from('tutor_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (tutorError) {
                console.warn('⚠️ tutor_profiles 未找到或載入失敗，建立預設值:', tutorError);
                currentTutorProfile = {
                    user_id: userId,
                    subjects: [],
                    hourly_rate: 0,
                    qualification: '',
                    teaching_experience: '',
                    self_introduction: '',
                    is_paid: false,
                    can_teach_grades: [],
                    avatar_url: null
                };
            } else {
                currentTutorProfile = tutorData;
                console.log('✅ tutor_profiles 載入成功:', currentTutorProfile);
            }
        }
    } catch (error) {
        console.error('❌ loadProfile 總錯誤:', error);
        showToast('載入個人資料失敗', 'error');
    }
}

function updateAuthUI() {
    console.log('🔄 updateAuthUI 開始');
    console.log('📋 currentUser:', currentUser);
    console.log('📋 currentProfile:', currentProfile);

    // 移除临时样式标签
    const tempStyle = document.getElementById('nav-state-style');
    if (tempStyle) {
        tempStyle.remove();
    }

    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');
    
    if (authButtons && userMenu) {
        if (currentUser && currentProfile) {
            console.log('✅ 已登入，顯示用戶選單');
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            if (userGreeting) {
                userGreeting.textContent = '你好, ' + (currentProfile.name || (currentUser && currentUser.email) || '用戶');
            }
        } else {
            console.log('🚫 未登入，顯示登入按鈕');
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }
}

async function loadTutors() {
    console.log('📥 loadTutors 開始');
    const tutorsList = document.getElementById('tutorsList');
    if (!tutorsList) return;
    
    tutorsList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>載入中...</h3></div>';
    
    try {
        let query = supabase
            .from('tutor_profiles')
            .select(`
                *,
                profiles!inner(*)
            `)
            .order('created_at', { ascending: false });
        
        const { data: tutorsData, error } = await query;
        
        if (error) {
            console.error('❌ 載入導師列表失敗:', error);
            throw error;
        }
        
        if (!tutorsData || tutorsData.length === 0) {
            tutorsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>暫無導師資料</h3>
                </div>
            `;
            return;
        }
        
        tutorsList.innerHTML = tutorsData.map(tutor => {
            const profile = tutor.profiles;
            const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : 'T';
            const subjectsText = tutor.subjects ? tutor.subjects.slice(0, 3).join(', ') + (tutor.subjects.length > 3 ? '...' : '') : '未設定';
            const locationText = (profile?.districts || []).join(', ') || profile?.district || '未設定';
            const gradesText = (tutor.can_teach_grades || []).join(', ') || '未設定';
            
            return `
                <div class="tutor-card" onclick="viewTutor('${tutor.user_id}')">
                    ${tutor.avatar_url ? 
                        `<img src="${tutor.avatar_url}" class="tutor-avatar" alt="${escapeHtml(profile?.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="tutor-avatar" style="display:none">${initial}</div>` : 
                        `<div class="tutor-avatar">${initial}</div>`}
                    <div class="tutor-name">${escapeHtml(profile?.name || '導師')}</div>
                    <div class="tutor-id">${escapeHtml(profile?.user_code || '未設定')}</div>
                    <div class="tutor-details">
                        <div class="tutor-detail-item">
                            <span class="tutor-detail-label">可教年級</span>
                            <span class="tutor-detail-value">${escapeHtml(gradesText)}</span>
                        </div>
                        <div class="tutor-detail-item">
                            <span class="tutor-detail-label">可教科目</span>
                            <span class="tutor-detail-value">${escapeHtml(subjectsText)}</span>
                        </div>
                        <div class="tutor-detail-item">
                            <span class="tutor-detail-label">學歷</span>
                            <span class="tutor-detail-value">${escapeHtml(tutor.qualification || '未設定')}</span>
                        </div>
                        <div class="tutor-detail-item">
                            <span class="tutor-detail-label">經驗</span>
                            <span class="tutor-detail-value">${escapeHtml(tutor.teaching_experience || '未設定')}</span>
                        </div>
                        <div class="tutor-detail-item">
                            <span class="tutor-detail-label">收費</span>
                            <span class="tutor-detail-value">$${tutor.hourly_rate || 0}/小時</span>
                        </div>
                        <div class="tutor-detail-item">
                            <span class="tutor-detail-label">地區</span>
                            <span class="tutor-detail-value">${escapeHtml(locationText)}</span>
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <button class="btn btn-primary" style="width: 100%;" onclick="event.stopPropagation(); viewTutor('${tutor.user_id}')">查看詳情</button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('❌ loadTutors 失敗:', error);
        tutorsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>載入失敗</h3>
                <p style="margin-top: 8px; font-size: 12px; color: var(--gray-600);">${error.message}</p>
            </div>
        `;
    }
}

async function viewTutor(userId) {
    window.location.href = `tutor.html?id=${userId}`;
}

function contactTutor(tutorId) {
    showToast('請使用「配對列表」發布申請', 'info');
}

function updatePostSubDistrict() {
    const district = document.getElementById('postDistrict')?.value;
    const subDistrictSelect = document.getElementById('postSubDistrict');
    if (!subDistrictSelect) return;
    subDistrictSelect.innerHTML = '';
    if (DISTRICT_MAP[district]) {
        DISTRICT_MAP[district].forEach(subDistrict => {
            const option = document.createElement('option');
            option.value = subDistrict;
            option.textContent = subDistrict;
            subDistrictSelect.appendChild(option);
        });
    }
}

function updateSubDistrictFilter() {
    const district = document.getElementById('filterDistrict')?.value;
    const subDistrictSelect = document.getElementById('filterSubDistrict');
    if (!subDistrictSelect) return;
    updateSubDistrictOptions(subDistrictSelect, district);
}

function updateSubDistrictOptions(selectElement, district) {
    selectElement.innerHTML = '';
    if (DISTRICT_MAP[district]) {
        DISTRICT_MAP[district].forEach(subDistrict => {
            const option = document.createElement('option');
            option.value = subDistrict;
            option.textContent = subDistrict;
            selectElement.appendChild(option);
        });
    }
}

function switchTab(tabType) {
    console.log('🔄 switchTab 被呼叫，tabType:', tabType);
    currentTabType = tabType;
    
    const tabTutorWanted = document.getElementById('tabTutorWanted');
    const tabStudentWanted = document.getElementById('tabStudentWanted');
    
    console.log('📋 tabTutorWanted 元素:', tabTutorWanted);
    console.log('📋 tabStudentWanted 元素:', tabStudentWanted);
    
    if (tabTutorWanted) tabTutorWanted.classList.toggle('active', tabType === 'tutor_wanted');
    if (tabStudentWanted) tabStudentWanted.classList.toggle('active', tabType === 'student_wanted');
    
    const filterSubjectEl = document.getElementById('filterSubject');
    if (filterSubjectEl) filterSubjectEl.value = '';
    
    const filterDistrictEl = document.getElementById('filterDistrict');
    if (filterDistrictEl) filterDistrictEl.value = '';
    
    const filterSubDistrictEl = document.getElementById('filterSubDistrict');
    if (filterSubDistrictEl) filterSubDistrictEl.value = '';
    
    const filterTeachingModeEl = document.getElementById('filterTeachingMode');
    if (filterTeachingModeEl) filterTeachingModeEl.value = '';
    
    updateSubDistrictFilter();
    loadPosts();
}

async function loadPosts() {
    console.log('📥 loadPosts 開始，currentTabType:', currentTabType);
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    postsList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>載入中...</h3></div>';
    
    try {
        const [countTutorResult, countStudentResult] = await Promise.all([
            supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'tutor_wanted').eq('status', 'active'),
            supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'student_wanted').eq('status', 'active')
        ]);
        
        console.log('📊 計數結果 - tutor_wanted:', countTutorResult.count, '| student_wanted:', countStudentResult.count);
        
        const tutorWantedCountEl = document.getElementById('tutorWantedCount');
        const studentWantedCountEl = document.getElementById('studentWantedCount');
        
        if (tutorWantedCountEl) tutorWantedCountEl.textContent = countTutorResult.count || 0;
        if (studentWantedCountEl) studentWantedCountEl.textContent = countStudentResult.count || 0;
        
        let query = supabase
            .from('posts')
            .select(`
                *,
                author: user_id (user_code, name)
            `)
            .eq('type', currentTabType)
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        
        const subjectFilter = document.getElementById('filterSubject')?.value;
        const teachingModeFilter = document.getElementById('filterTeachingMode')?.value;
        const districtFilter = document.getElementById('filterDistrict')?.value;
        const subDistrictFilter = document.getElementById('filterSubDistrict')?.value;
        
        console.log('🔍 過濾條件 - 科目:', subjectFilter, '| 上課模式:', teachingModeFilter, '| 大區域:', districtFilter, '| 詳細地區:', subDistrictFilter);
        
        if (subjectFilter) query = query.eq('subject', subjectFilter);
        if (teachingModeFilter) query = query.eq('teaching_mode', teachingModeFilter);
        if (districtFilter) query = query.eq('district', districtFilter);
        if (subDistrictFilter) query = query.eq('sub_district', subDistrictFilter);
        
        const { data: posts, error } = await query;
        
        if (error) throw error;
        
        if (!posts || posts.length === 0) {
            postsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>暫無 Post</h3>
                    <p>立即發布第一個！</p>
                </div>
            `;
            return;
        }
        
        postsList.innerHTML = posts.map(post => {
            const locationDisplay = (post.districts || []).join(', ') || post.district || '';
            const userCode = post.author?.user_code || '未知';
            const postCode = post.post_code || '';
            const typeLabel = post.type === 'tutor_wanted' ? '📚 學生個案' : '🎓 導師列表';
            const typeClass = post.type === 'tutor_wanted' ? 'tag-tutor' : 'tag-student';
            
            let teachingModeLabel = '';
            if (post.teaching_mode === '視像補習') {
                teachingModeLabel = '💻 視像補習';
            } else if (post.teaching_mode === '面對面授課') {
                teachingModeLabel = '🏫 面對面授課';
            } else if (post.teaching_mode === '兩者皆可') {
                teachingModeLabel = '💻🏫 兩者皆可';
            }
            
            return `
                <div class="post-card" onclick="viewPost('${post.id}')">
                    <div class="post-header">
                        <h3 class="post-title">${postCode ? `<span style="color: var(--primary-color); font-weight:600;">${escapeHtml(postCode)}</span> · ` : ''}${escapeHtml(post.title || '無標題')}</h3>
                        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                            <span class="post-tag ${typeClass}">${typeLabel}</span>
                            <span class="post-tag tag-subject">${escapeHtml(post.subject || '其他')}</span>
                            ${teachingModeLabel ? `<span class="post-tag tag-subject">${teachingModeLabel}</span>` : ''}
                        </div>
                    </div>
                    <div class="post-meta">
                        ${locationDisplay ? `<span class="meta-item">📍 ${escapeHtml(locationDisplay)}</span>` : ''}
                        ${post.budget_or_rate ? `<span class="meta-item">💰 $${post.budget_or_rate}/hr</span>` : ''}
                    </div>
                    <p class="post-description">${escapeHtml((post.description || '').substring(0, 100))}${(post.description || '').length > 100 ? '...' : ''}</p>
                    <div class="post-footer">
                        <span class="post-author">由 ${userCode} 發布 · ${formatDate(post.created_at)}</span>
                        <div class="post-actions">
                            <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); viewPost('${post.id}')">查看詳情</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading posts:', error);
        postsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>載入失敗</h3>
                <p style="margin-top: 8px; font-size: 12px; color: var(--gray-600);">${error.message}</p>
            </div>
        `;
    }
}

async function viewPost(postId) {
    window.location.href = `detail.html?id=${postId}`;
}

function hasContactInfo(text) {
    if (!text) return false;
    const patterns = [
        /whatsapp|whats app|instagram|facebook|telegram|wechat|微信|line/i,
        /\b\d{8}\b/
    ];
    return patterns.some(p => p.test(text));
}

async function generateAndSetUserCode(role) {
    try {
        const { data: counterData, error: counterError } = await supabase
            .from('counter')
            .select('current_value')
            .eq('id', role)
            .single();
        
        if (counterError) throw counterError;
        
        const nextValue = (counterData.current_value || 0) + 1;
        const prefix = role === 'student' ? 'S' : 'T';
        const userCode = prefix + String(nextValue).padStart(4, '0');
        
        const { error: updateCounterError } = await supabase
            .from('counter')
            .update({ current_value: nextValue })
            .eq('id', role);
        
        if (updateCounterError) throw updateCounterError;
        
        const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ user_code: userCode })
            .eq('id', currentUser.id);
        
        if (updateProfileError) throw updateProfileError;
        
        await loadProfile(currentUser.id);
        
    } catch (error) {
        console.error('Error generating user code:', error);
    }
}

async function generateAndSetPostCode() {
    try {
        const { data: counterData, error: counterError } = await supabase
            .from('counter')
            .select('current_value')
            .eq('id', 'posts')
            .single();
        
        if (counterError) throw counterError;
        
        const nextValue = (counterData.current_value || 0) + 1;
        const postCode = 'P' + String(nextValue).padStart(4, '0');
        
        const { error: updateCounterError } = await supabase
            .from('counter')
            .update({ current_value: nextValue })
            .eq('id', 'posts');
        
        if (updateCounterError) throw updateCounterError;
        
        return postCode;
        
    } catch (error) {
        console.error('Error generating post code:', error);
        return null;
    }
}

async function logout() {
    try {
        await supabase.auth.signOut();
        currentUser = null;
        currentProfile = null;
        currentTutorProfile = null;
        saveAuthStateToStorage();
        window.location.href = 'index.html';
        showToast('已登出', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function openWhatsAppApplication(postId) {
    if (!currentUser) { 
        window.location.href = 'auth.html';
        showToast('請先登入', 'warning'); 
        return; 
    }
    
    try {
        const { data: post, error: postError } = await supabase
            .from('posts')
            .select(`
                *,
                author: user_id (user_code, name)
            `)
            .eq('id', postId)
            .single();
        
        if (postError) throw postError;
        
        const applicantUserCode = currentProfile?.user_code || '未知';
        const applicantName = currentProfile?.name || '匿名';
        const applicantPhone = currentProfile?.phone || '未提供';
        const applicantDistrict = currentProfile?.district && currentProfile?.sub_district ? 
            `${currentProfile.district} - ${currentProfile.sub_district}` : 
            currentProfile?.district || currentProfile?.sub_district || '未提供';
        
        const postCode = post.post_code || post.id;
        const authorUserCode = post.author?.user_code || '未知';
        
        let message;
        if (post.type === 'tutor_wanted') {
            message = `【學生個案申請】
Post: ${postCode} - ${post.title}（由 ${authorUserCode} 發布）
申請人用戶 ID: ${applicantUserCode}
申請人姓名: ${applicantName}
申請人電話: ${applicantPhone}
申請人地區: ${applicantDistrict}

請幫忙聯絡雙方，謝謝！`;
        } else {
            message = `【導師列表申請】
Post: ${postCode} - ${post.title}（由 ${authorUserCode} 發布）
申請人用戶 ID: ${applicantUserCode}
申請人姓名: ${applicantName}
申請人電話: ${applicantPhone}
申請人地區: ${applicantDistrict}

請幫忙聯絡雙方，謝謝！`;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/85266007458?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        showToast('生成申請訊息失敗', 'error');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    console.log('🔑 handleLogin 開始執行');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log('📧 嘗試登入電郵:', email);
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        console.log('✅ 登入成功，data.user:', data.user);
        currentUser = data.user;

        console.log('📥 開始載入個人檔案...');
        await loadProfile(currentUser.id);
        console.log('📦 個人檔案載入完成:', currentProfile);
        
        saveAuthStateToStorage();
        
        showToast('登入成功！', 'success');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('❌ Login error:', error);
        showToast(error.message, 'error');
    }
}

async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });
        
        if (error) throw error;
        
        // Google 會自動跳轉去 Google 登入頁面，唔使 showToast
    } catch (error) {
        console.error('❌ Google 登入失敗:', error);
        showToast(error.message, 'error');
    }
}

// Initialize register form options
function initRegisterForm() {
    // Initialize district options
    const districtContainer = document.getElementById('registerDistrictOptions');
    if (districtContainer) {
        districtContainer.innerHTML = '';
        Object.keys(DISTRICT_MAP).forEach(mainDistrict => {
            const groupDiv = document.createElement('div');
            groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin-bottom: 4px; display: block;">${mainDistrict}</label>`;
            const subDiv = document.createElement('div');
            subDiv.style.display = 'flex';
            subDiv.style.flexWrap = 'wrap';
            subDiv.style.gap = '8px';
            DISTRICT_MAP[mainDistrict].forEach(subDistrict => {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '6px';
                label.style.cursor = 'pointer';
                label.style.padding = '6px 12px';
                label.style.border = '1px solid var(--gray-200)';
                label.style.borderRadius = '6px';
                label.innerHTML = `
                    <input type="checkbox" name="registerDistricts" value="${subDistrict}">
                    <span>${subDistrict}</span>
                `;
                subDiv.appendChild(label);
            });
            groupDiv.appendChild(subDiv);
            districtContainer.appendChild(groupDiv);
        });
    }

    // Initialize grade options
    initGradeOptions();

    // Default to show student grade
    toggleRegisterGrade();
}

// Initialize grade options
function initGradeOptions() {
    const gradeContainer = document.getElementById('registerGradeOptions');
    if (gradeContainer) {
        gradeContainer.innerHTML = '';
        Object.keys(GRADE_OPTIONS).forEach(category => {
            const groupDiv = document.createElement('div');
            groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin-bottom: 4px; display: block;">${category}</label>`;
            const subDiv = document.createElement('div');
            subDiv.style.display = 'flex';
            subDiv.style.flexWrap = 'wrap';
            subDiv.style.gap = '8px';
            GRADE_OPTIONS[category].forEach(grade => {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '6px';
                label.style.cursor = 'pointer';
                label.style.padding = '6px 12px';
                label.style.border = '1px solid var(--gray-200)';
                label.style.borderRadius = '6px';
                label.innerHTML = `
                    <input type="radio" name="registerGrade" value="${grade}">
                    <span>${grade}</span>
                `;
                subDiv.appendChild(label);
            });
            groupDiv.appendChild(subDiv);
            gradeContainer.appendChild(groupDiv);
        });
    }
}

// Toggle grade field visibility (only students see this)
function toggleRegisterGrade() {
    const roleSelect = document.getElementById('registerRole');
    const gradeField = document.getElementById('registerGradeField');
    if (roleSelect && gradeField) {
        const role = roleSelect.value;
        if (role === 'student') {
            gradeField.style.display = 'block';
        } else {
            gradeField.style.display = 'none';
        }
    }
}

// Handle register - using trigger to auto-create profile
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const role = document.getElementById('registerRole').value;

    // Get selected districts
    const selectedDistricts = Array.from(document.querySelectorAll('input[name="registerDistricts"]:checked')).map(el => el.value);
    
    // Get selected grade (only for students)
    let selectedGrade = null;
    if (role === 'student') {
        const gradeRadio = document.querySelector('input[name="registerGrade"]:checked');
        selectedGrade = gradeRadio ? gradeRadio.value : null;
    }
    
    try {
        // Create Auth user, pass data to trigger
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone,
                    role,
                    districts: selectedDistricts,
                    grade: selectedGrade
                }
            }
        });
        
        if (authError) throw authError;
        
        // ✅ 新增：註冊成功後立即登出，清除 session
        if (authData.user) {
            await supabase.auth.signOut();
            currentUser = null;
            currentProfile = null;
            currentTutorProfile = null;
            saveAuthStateToStorage();
            updateAuthUI();
        }
        
        showToast('註冊成功！請登入', 'success');
        switchAuthTab('login');
        
        // 清空表單
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerName').value = '';
        document.getElementById('registerPhone').value = '';
        document.querySelectorAll('input[name="registerDistricts"]:checked').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[name="registerGrade"]:checked').forEach(cb => cb.checked = false);
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message, 'error');
    }
}

// Initialize profile district options
function initProfileDistrictOptions() {
    const container = document.getElementById('editDistrictOptions');
    if (!container) return;
    container.innerHTML = '';
    const currentDistricts = currentProfile?.districts || [];
    Object.keys(DISTRICT_MAP).forEach(mainDistrict => {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin: 8px 0 4px; display: block;">${mainDistrict}</label>`;
        const subDiv = document.createElement('div');
        subDiv.style.display = 'flex';
        subDiv.style.flexWrap = 'wrap';
        subDiv.style.gap = '8px';
        DISTRICT_MAP[mainDistrict].forEach(subDistrict => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '6px';
            label.style.cursor = 'pointer';
            label.style.padding = '6px 12px';
            label.style.border = '1px solid var(--gray-200)';
            label.style.borderRadius = '6px';
            const checked = currentDistricts.includes(subDistrict) ? 'checked' : '';
            label.innerHTML = `
                <input type="checkbox" name="profileDistricts" value="${subDistrict}" ${checked} onchange="handleProfileDistrictChange(this)">
                <span>${subDistrict}</span>
            `;
            subDiv.appendChild(label);
        });
        groupDiv.appendChild(subDiv);
        container.appendChild(groupDiv);
    });
}

function initTutorDistrictOptions() {
    const container = document.getElementById('tutorDistrictOptions');
    if (!container) return;
    container.innerHTML = '';
    const currentDistricts = currentProfile?.districts || [];
    Object.keys(DISTRICT_MAP).forEach(mainDistrict => {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin: 8px 0 4px; display: block;">${mainDistrict}</label>`;
        const subDiv = document.createElement('div');
        subDiv.style.display = 'flex';
        subDiv.style.flexWrap = 'wrap';
        subDiv.style.gap = '8px';
        DISTRICT_MAP[mainDistrict].forEach(subDistrict => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '6px';
            label.style.cursor = 'pointer';
            label.style.padding = '6px 12px';
            label.style.border = '1px solid var(--gray-200)';
            label.style.borderRadius = '6px';
            const checked = currentDistricts.includes(subDistrict) ? 'checked' : '';
            label.innerHTML = `
                <input type="checkbox" name="tutorDistricts" value="${subDistrict}" ${checked} onchange="handleTutorDistrictChange(this)">
                <span>${subDistrict}</span>
            `;
            subDiv.appendChild(label);
        });
        groupDiv.appendChild(subDiv);
        container.appendChild(groupDiv);
    });
}

function toggleEditProfile() {
    isEditingProfile = !isEditingProfile;
    const details = document.getElementById('profileDetails');
    const form = document.getElementById('editProfileForm');
    const btn = document.getElementById('editProfileBtn');
    
    if (isEditingProfile) {
        if (details) details.style.display = 'none';
        if (form) form.style.display = 'block';
        if (btn) {
            btn.textContent = '取消編輯';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        }
        initProfileDistrictOptions();
    } else {
        if (details) details.style.display = 'block';
        if (form) form.style.display = 'none';
        if (btn) {
            btn.textContent = '✏️ 編輯個人資料';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    try {
        const name = document.getElementById('editName').value;
        const phone = document.getElementById('editPhone').value;
        const newRole = document.getElementById('editRole')?.value;
        const districts = currentProfile?.districts || [];
        const grade = currentProfile?.role === 'student' ? document.getElementById('editGrade')?.value : null;
        
        const updateData = {
            name,
            phone,
            districts,
            district: districts[0] || currentProfile?.district || ''
        };

        // ✅ 如果更改了身份
        if (newRole && newRole !== currentProfile.role) {
            updateData.role = newRole;
            
            if (newRole === 'tutor') {
                // 轉做導師：檢查有冇 tutor_profiles
                const { data: existingTutor } = await supabase
                    .from('tutor_profiles')
                    .select('id')
                    .eq('user_id', currentUser.id)
                    .maybeSingle();
                
                if (!existingTutor) {
                    await supabase
                        .from('tutor_profiles')
                        .insert({
                            user_id: currentUser.id,
                            subjects: [],
                            hourly_rate: 0,
                            qualification: '',
                            teaching_experience: '',
                            self_introduction: '',
                            can_teach_grades: [],
                            is_paid: false,
                            avatar_url: null
                        });
                }
                showToast('已轉為導師，請完善導師資料', 'success');
            } else if (newRole === 'student') {
                showToast('已轉為學生', 'success');
            }
        }
        
        if (currentProfile?.role === 'student' || newRole === 'student') {
            updateData.grade = grade || '';
        }
        
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', currentUser.id);
        
        if (error) throw error;
        
        await loadProfile(currentUser.id);
        showToast('個人資料已更新！', 'success');
        toggleEditProfile();
        loadProfilePage();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast(error.message, 'error');
    }
}

// Tutor profile edit functions
function initTutorGradeOptions() {
    const container = document.getElementById('tutorGradeOptions');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(GRADE_OPTIONS).forEach(category => {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin: 8px 0 4px; display: block;">${category}</label>`;
        const subDiv = document.createElement('div');
        subDiv.style.display = 'flex';
        subDiv.style.flexWrap = 'wrap';
        subDiv.style.gap = '8px';
        GRADE_OPTIONS[category].forEach(grade => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '6px';
            label.style.cursor = 'pointer';
            label.style.padding = '6px 12px';
            label.style.border = '1px solid var(--gray-200)';
            label.style.borderRadius = '6px';
            const checked = selectedTutorGrades.includes(grade) ? 'checked' : '';
            label.innerHTML = `
                <input type="checkbox" value="${grade}" ${checked} onchange="handleTutorGradeChange(this)">
                <span>${grade}</span>
            `;
            subDiv.appendChild(label);
        });
        groupDiv.appendChild(subDiv);
        container.appendChild(groupDiv);
    });
    // Initialize subject options
    updateTutorSubjectOptions();
}

function updateTutorSubjectOptions() {
    const container = document.getElementById('tutorSubjectOptions');
    if (!container) return;
    container.innerHTML = '';
    
    // Get all subjects for selected grades, deduplicate
    const subjectsSet = new Set();
    selectedTutorGrades.forEach(grade => {
        const subjects = GRADE_SUBJECTS_MAP[grade];
        if (subjects) {
            subjects.forEach(s => subjectsSet.add(s));
        }
    });
    
    const subjects = Array.from(subjectsSet);
    if (subjects.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-600);">請先選擇可教年級</p>';
        const otherField = document.getElementById('tutorOtherSubjectField');
        if (otherField) otherField.style.display = 'none';
        return;
    }

    const otherField = document.getElementById('tutorOtherSubjectField');
    if (otherField) {
        otherField.style.display = 'block';
    }

    subjects.forEach(subject => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '6px';
        label.style.cursor = 'pointer';
        label.style.padding = '6px 12px';
        label.style.border = '1px solid var(--gray-200)';
        label.style.borderRadius = '6px';
        const checked = selectedTutorSubjects.includes(subject) ? 'checked' : '';
        label.innerHTML = `
            <input type="checkbox" value="${subject}" ${checked} onchange="handleTutorSubjectChange(this)">
            <span>${subject}</span>
        `;
        container.appendChild(label);
    });
}

function toggleEditTutorProfile() {
    isEditingTutorProfile = !isEditingTutorProfile;
    const form = document.getElementById('editTutorForm');
    const btn = document.getElementById('editTutorBtn');
    
    if (isEditingTutorProfile) {
        // Load current values
        selectedTutorGrades = [...(currentTutorProfile?.can_teach_grades || [])];
        const availableSubjects = new Set();
        selectedTutorGrades.forEach(grade => {
            const gradeSubjects = GRADE_SUBJECTS_MAP[grade] || [];
            gradeSubjects.forEach(subject => availableSubjects.add(subject));
        });
        selectedTutorSubjects = (currentTutorProfile?.subjects || []).filter(subject => availableSubjects.has(subject));
        tutorOtherSubjectText = (currentTutorProfile?.subjects || []).filter(subject => !availableSubjects.has(subject)).join(', ');
        
        if (form) form.style.display = 'block';
        if (btn) btn.textContent = '取消編輯';
        initTutorDistrictOptions();
        initTutorGradeOptions();
        
        // Set current values
        const hourlyRate = document.getElementById('tutorHourlyRate');
        const qualification = document.getElementById('tutorQualification');
        const experience = document.getElementById('tutorExperience');
        const selfIntroduction = document.getElementById('tutorSelfIntroduction');
        const otherSubject = document.getElementById('tutorOtherSubject');
        if (hourlyRate) hourlyRate.value = currentTutorProfile?.hourly_rate || 0;
        if (qualification) qualification.value = currentTutorProfile?.qualification || '';
        if (experience) experience.value = currentTutorProfile?.teaching_experience || '';
        if (selfIntroduction) selfIntroduction.value = currentTutorProfile?.self_introduction || '';
        if (otherSubject) otherSubject.value = tutorOtherSubjectText;
    } else {
        if (form) form.style.display = 'none';
        if (btn) btn.textContent = '✏️ 編輯導師檔案';
    }
}

async function handleUpdateTutorProfile(event) {
    event.preventDefault();
    try {
        const tutorDistricts = currentProfile?.districts || [];
        const hourlyRate = parseInt(document.getElementById('tutorHourlyRate')?.value) || 0;
        const qualification = document.getElementById('tutorQualification')?.value || '';
        const experience = document.getElementById('tutorExperience')?.value || '';
        const selfIntroduction = document.getElementById('tutorSelfIntroduction')?.value || '';
        let subjects = [...selectedTutorSubjects];
        
        // Add custom subjects from the free-text input.
        const otherSubject = document.getElementById('tutorOtherSubject');
        if (otherSubject?.value) {
            const customSubjects = otherSubject.value
                .split(/[,\n，、]+/)
                .map(subject => subject.trim())
                .filter(Boolean);
            subjects = [...new Set([...subjects, ...customSubjects])];
        }

        const { error: tutorProfileError } = await supabase
            .from('tutor_profiles')
            .update({
                can_teach_grades: selectedTutorGrades,
                subjects,
                hourly_rate: hourlyRate,
                qualification,
                teaching_experience: experience,
                self_introduction: selfIntroduction
            })
            .eq('user_id', currentUser.id);

        if (tutorProfileError) throw tutorProfileError;

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                districts: tutorDistricts,
                district: tutorDistricts[0] || currentProfile?.district || ''
            })
            .eq('id', currentUser.id);
        
        if (profileError) throw profileError;
        
        await loadProfile(currentUser.id);
        showToast('導師檔案已更新！', 'success');
        toggleEditTutorProfile();
        loadProfilePage();
    } catch (error) {
        console.error('Error updating tutor profile:', error);
        showToast(error.message, 'error');
    }
}

// Avatar upload functions
function openAvatarUpload() {
    const modal = document.getElementById('avatarUploadModal');
    if (modal) modal.classList.add('active');
    const previewContainer = document.getElementById('avatarPreviewContainer');
    if (previewContainer) previewContainer.style.display = 'none';
}

function setupAvatarPreview() {
    const fileInput = document.getElementById('avatarFile');
    if (!fileInput) return;
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            const previewImg = document.getElementById('avatarPreview');
            const previewContainer = document.getElementById('avatarPreviewContainer');
            
            reader.onload = function(e) {
                if (previewImg) previewImg.src = e.target.result;
                if (previewContainer) previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

async function handleAvatarUpload() {
    const fileInput = document.getElementById('avatarFile');
    if (!fileInput) return;
    
    const file = fileInput.files[0];
    
    if (!file) {
        showToast('請選擇圖片', 'warning');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('圖片大小不能超過 5MB', 'error');
        return;
    }
    
    try {
        const fileExt = file.name.split('.').pop();
        const timestamp = new Date().getTime();
        const fileName = `${currentUser.id}/${timestamp}.${fileExt}`;
        
        showToast('上傳中...', 'info');
        
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
        
        // Update tutor profile
        const { error: updateError } = await supabase
            .from('tutor_profiles')
            .update({ avatar_url: publicUrl })
            .eq('user_id', currentUser.id);
        
        if (updateError) throw updateError;
        
        await loadProfile(currentUser.id);
        
        showToast('頭像上傳成功！', 'success');
        closeModal('avatarUploadModal');
        loadProfilePage();
        
    } catch (error) {
        console.error('❌ 頭像上傳失敗:', error);
        showToast(error.message, 'error');
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStarDisplay();
        });
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.dataset.rating);
            stars.forEach((s, i) => s.classList.toggle('active', i < hoverRating));
        });
    });
    
    const starRatingContainer = document.getElementById('starRating');
    if (starRatingContainer) {
        starRatingContainer.addEventListener('mouseleave', updateStarDisplay);
    }
}

function updateStarDisplay() {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
}

function openReviewModal(applicationId, targetId) {
    selectedReview = { applicationId, targetId };
    selectedRating = 0;
    const commentInput = document.getElementById('reviewComment');
    if (commentInput) commentInput.value = '';
    updateStarDisplay();
    const modal = document.getElementById('reviewModal');
    if (modal) modal.classList.add('active');
}

async function handleReview(event) {
    event.preventDefault();
    if (selectedRating === 0) { 
        showToast('請選擇評分', 'warning'); 
        return; 
    }
    
    try {
        const commentInput = document.getElementById('reviewComment');
        const comment = commentInput ? commentInput.value : '';
        
        const { error } = await supabase
            .from('reviews')
            .insert({
                application_id: selectedReview.applicationId,
                reviewer_id: currentUser.id,
                target_id: selectedReview.targetId,
                rating: selectedRating,
                comment
            });
        
        if (error) throw error;
        
        showToast('評價已提交！', 'success');
        closeModal('reviewModal');
        
    } catch (error) {
        console.error('Error submitting review:', error);
        showToast(error.message, 'error');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Initialize post district options
function initPostDistrictOptions() {
    const container = document.getElementById('postDistrictOptions');
    if (!container) return;
    container.innerHTML = '';
    selectedPostDistricts = [];
    Object.keys(DISTRICT_MAP).forEach(mainDistrict => {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin: 8px 0 4px; display: block;">${mainDistrict}</label>`;
        const subDiv = document.createElement('div');
        subDiv.style.display = 'flex';
        subDiv.style.flexWrap = 'wrap';
        subDiv.style.gap = '8px';
        DISTRICT_MAP[mainDistrict].forEach(subDistrict => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '6px';
            label.style.cursor = 'pointer';
            label.style.padding = '6px 12px';
            label.style.border = '1px solid var(--gray-200)';
            label.style.borderRadius = '6px';
            label.innerHTML = `
                <input type="checkbox" name="postDistricts" value="${subDistrict}" onchange="handlePostDistrictChange(this)">
                <span>${subDistrict}</span>
            `;
            subDiv.appendChild(label);
        });
        groupDiv.appendChild(subDiv);
        container.appendChild(groupDiv);
    });
}

function handlePostDistrictChange(checkbox) {
    if (checkbox.checked) {
        if (!selectedPostDistricts.includes(checkbox.value)) {
            selectedPostDistricts.push(checkbox.value);
        }
    } else {
        selectedPostDistricts = selectedPostDistricts.filter(d => d !== checkbox.value);
    }
}

function setupCreatePostPage() {
    const titleEl = document.getElementById('createPostTitle');
    const qualificationLabel = document.querySelector('#qualificationField label');
    
    if (currentProfile?.role === 'student') {
        // 學生 Post：顯示「導師要求」
        selectedPostType = 'tutor_wanted';
        if (titleEl) titleEl.textContent = '發布學生個案';
        if (qualificationLabel) qualificationLabel.textContent = '導師要求';
        document.getElementById('budgetField').style.display = 'block';
        document.getElementById('rateField').style.display = 'none';
        document.getElementById('experienceField').style.display = 'none';
    } else if (currentProfile?.role === 'tutor') {
        // 導師 Post：顯示「導師學歷」
        selectedPostType = 'student_wanted';
        if (titleEl) titleEl.textContent = '發布導師列表';
        if (qualificationLabel) qualificationLabel.textContent = '導師學歷';
        document.getElementById('budgetField').style.display = 'none';
        document.getElementById('rateField').style.display = 'block';
        document.getElementById('experienceField').style.display = 'block';
    }
    initPostDistrictOptions();
}

async function handleCreatePost(event) {
    event.preventDefault();
    console.log('📝 handleCreatePost 開始');
    console.log('👤 currentUser:', currentUser);
    console.log('👤 currentProfile:', currentProfile);
    console.log('📋 selectedPostType:', selectedPostType);
    console.log('📍 selectedPostDistricts:', selectedPostDistricts);
    
    if (!currentUser) { 
        console.log('❌ 未登入，跳轉到 auth 頁面');
        window.location.href = 'auth.html';
        showToast('請先登入', 'warning'); 
        return; 
    }
    
    // Validate post type matches user role
    if (currentProfile?.role === 'student' && selectedPostType !== 'tutor_wanted') {
        showToast('學生只能發布「學生個案」', 'error');
        return;
    }
    if (currentProfile?.role === 'tutor' && selectedPostType !== 'student_wanted') {
        showToast('導師只能發布「導師列表」', 'error');
        return;
    }

    // Validate districts
    if (selectedPostDistricts.length === 0) {
        showToast('請至少選擇一個地區', 'error');
        return;
    }
    
    const title = document.getElementById('postTitle')?.value || '';
    const subject = document.getElementById('postSubject')?.value || '';
    const teachingMode = document.getElementById('postTeachingMode')?.value || '';
    const description = document.getElementById('postDescription')?.value || '';
    const qualification = document.getElementById('postQualification')?.value || '';
    const budgetOrRateInput = selectedPostType === 'tutor_wanted' ? 
        document.getElementById('postBudget') : 
        document.getElementById('postRate');
    const budgetOrRate = budgetOrRateInput?.value || '';
    const teachingExperience = document.getElementById('postExperience')?.value || '';
    
    if (hasContactInfo(title) || hasContactInfo(description) || hasContactInfo(qualification) || hasContactInfo(teachingExperience)) {
        showToast('請勿在Post中留下聯絡方式', 'error');
        return;
    }
    
    try {
        // Generate short post ID
        const postCode = await generateAndSetPostCode();
        console.log('🏷️ 生成的 postCode:', postCode);
        
        const postData = {
            user_id: currentUser.id,
            type: selectedPostType,
            title,
            subject,
            teaching_mode: teachingMode,
            districts: selectedPostDistricts,
            district: selectedPostDistricts[0] || '',
            description,
            status: 'active'
        };
        
        if (postCode) postData.post_code = postCode;
        if (budgetOrRate) postData.budget_or_rate = parseInt(budgetOrRate);
        if (qualification) postData.qualification = qualification;
        if (teachingExperience) postData.teaching_experience = teachingExperience;
        
        console.log('📝 即將插入的 postData:', postData);
        
        const { error } = await supabase
            .from('posts')
            .insert(postData);
        
        if (error) throw error;
        
        console.log('✅ Post 發布成功！');
        showToast('Post 發布成功！', 'success');
        window.location.href = 'match.html';
        
    } catch (error) {
        console.error('❌ Error creating post:', error);
        showToast(error.message, 'error');
    }
}

async function viewPost(postId) {
    window.location.href = `detail.html?id=${postId}`;
}

async function loadProfilePage() {
    const content = document.getElementById('profileContent');
    if (!content) return;
    
    content.innerHTML = '<div class="empty-state">載入中...</div>';
    
    try {
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        const { data: reviewsReceived, error: reviewsError } = await supabase
            .from('reviews')
            .select(`
                *,
                reviewer: reviewer_id (name)
            `)
            .eq('target_id', currentUser.id);
        
        const averageRating = reviewsReceived && reviewsReceived.length > 0 ? 
            reviewsReceived.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsReceived.length : 0;
        
        const locationDisplay = (currentProfile?.districts || []).join(', ') || '';
        const gradeDisplay = currentProfile?.grade || '';
        
        let tutorInfo = '';
        if (currentProfile?.role === 'tutor' && currentTutorProfile) {
            tutorInfo = `
                <div class="profile-details" style="margin-top: 24px;">
                    <div class="detail-item">
                        <div class="detail-label">可教年級</div>
                        <div class="detail-value">${(currentTutorProfile.can_teach_grades || []).join(', ') || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">可教科目</div>
                        <div class="detail-value">${(currentTutorProfile.subjects || []).join(', ') || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">每小時收費</div>
                        <div class="detail-value">$${currentTutorProfile.hourly_rate || 0}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">學歷</div>
                        <div class="detail-value">${currentTutorProfile.qualification || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">教學經驗</div>
                        <div class="detail-value">${currentTutorProfile.teaching_experience || '未設定'}</div>
                    </div>
                </div>
                <div style="margin-top: 16px; display: flex; gap: 12px;">
                    <button class="btn btn-secondary" onclick="toggleEditTutorProfile()" id="editTutorBtn">✏️ 編輯導師資料</button>
                    <button class="btn btn-secondary" onclick="openAvatarUpload()">🖼️ 上傳頭像</button>
                </div>
                
                <div id="editTutorForm" style="display: none; margin-top: 24px;">
                    <form id="tutorEditForm" onsubmit="handleUpdateTutorProfile(event)">
                        <div class="form-group">
                            <label>可教年級</label>
                            <div id="tutorGradeOptions"></div>
                        </div>
                        <div class="form-group">
                            <label>可教科目</label>
                            <div id="tutorSubjectOptions"></div>
                        </div>
                        <div class="form-group" id="tutorOtherSubjectField" style="display: none;">
                            <label>其他科目</label>
                            <input type="text" class="form-control" id="tutorOtherSubject">
                        </div>
                        <div class="form-group">
                            <label>每小時收費</label>
                            <input type="number" class="form-control" id="tutorHourlyRate">
                        </div>
                        <div class="form-group">
                            <label>學歷</label>
                            <input type="text" class="form-control" id="tutorQualification">
                        </div>
                        <div class="form-group">
                            <label>教學經驗</label>
                            <input type="text" class="form-control" id="tutorExperience">
                        </div>
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="toggleEditTutorProfile()">取消</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">儲存</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        content.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    ${currentProfile.role === 'tutor' && currentTutorProfile?.avatar_url ? 
                        `<img src="${currentTutorProfile.avatar_url}" class="profile-avatar" alt="${escapeHtml(currentProfile.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="profile-avatar" style="display:none">${(currentProfile.name || 'U')[0].toUpperCase()}</div>` : 
                        `<div class="profile-avatar">${(currentProfile.name || 'U')[0].toUpperCase()}</div>`}
                    <div class="profile-info">
                        <h2>${escapeHtml(currentProfile.name || currentUser.email)}</h2>
                        <p style="color: var(--gray-600);">${currentProfile.role === 'tutor' ? '導師' : '學生'}${locationDisplay ? ` · ${escapeHtml(locationDisplay)}` : ''}</p>
                        ${currentProfile.role === 'student' && gradeDisplay ? `<p style="color: var(--gray-600);">年級：${escapeHtml(gradeDisplay)}</p>` : ''}
                        <p style="color: var(--primary-color); font-weight: 600; margin-top: 4px;">用戶 ID: ${currentProfile?.user_code || '未設定'}</p>
                        ${averageRating > 0 ? `<div class="rating" style="margin-top: 8px;">${renderStars(Math.round(averageRating))} (${reviewsReceived.length} 則評價)</div>` : ''}
                    </div>
                </div>
                
                <div style="margin-bottom: 20px; text-align: right;">
                    <button class="btn btn-secondary" onclick="toggleEditProfile()" id="editProfileBtn">✏️ 編輯資料</button>
                </div>
                
                <div id="profileDetails">
                    <div class="profile-details">
                        <div class="detail-item">
                            <div class="detail-label">電郵</div>
                            <div class="detail-value">${escapeHtml(currentProfile.email || currentUser.email)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">電話</div>
                            <div class="detail-value">${escapeHtml(currentProfile.phone || '')}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">角色</div>
                            <div class="detail-value">${currentProfile.role === 'tutor' ? '導師' : '學生'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">可補習地區</div>
                            <div class="detail-value">${locationDisplay || '未設定'}</div>
                        </div>
                        ${currentProfile.role === 'student' ? `<div class="detail-item"><div class="detail-label">年級</div><div class="detail-value">${gradeDisplay || '未設定'}</div></div>` : ''}
                    </div>
                </div>
                
                <div id="editProfileForm" style="display: none;">
                    <form id="profileEditForm" onsubmit="handleUpdateProfile(event)">
                        <div class="form-group">
                            <label>姓名</label>
                            <input type="text" class="form-control" id="editName" value="${escapeHtml(currentProfile.name || '')}" required>
                        </div>
                        <div class="form-group">
                            <label>電話號碼</label>
                            <input type="tel" class="form-control" id="editPhone" value="${escapeHtml(currentProfile.phone || '')}" required>
                        </div>
                        <div class="form-group">
                            <label>可補習地區（可多選）</label>
                            <div id="editDistrictOptions"></div>
                        </div>
                        ${currentProfile.role === 'student' ? `
                            <div class="form-group">
                                <label>年級</label>
                                <select class="form-control" id="editGrade">
                                    <option value="">選擇年級</option>
                                    ${Object.entries(GRADE_OPTIONS).flatMap(([cat, grades]) => 
                                        grades.map(g => `<option value="${g}" ${currentProfile.grade === g ? 'selected' : ''}>${cat} - ${g}</option>`)
                                    ).join('')}
                                </select>
                            </div>
                        ` : ''}
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="toggleEditProfile()">取消</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">儲存</button>
                        </div>
                    </form>
                </div>
                
                ${tutorInfo}
            </div>
            
            <div class="profile-card" style="margin-top: 24px;">
                <h3 style="margin-bottom: 16px;">我的 Post</h3>
                ${posts && posts.length > 0 ? `
                    <div class="posts-grid">
                        ${posts.map(post => {
                            const postLocationDisplay = (post.districts || []).join(', ') || (post.district || '');
                            const postCode = post.post_code || '';
                            return `
                                <div class="post-card">
                                    <div class="post-header" onclick="viewPost('${post.id}')" style="cursor: pointer;">
                                        <h3 class="post-title">${postCode ? `<span style="color: var(--primary-color); font-weight:600;">${escapeHtml(postCode)}</span> · ` : ''}${escapeHtml(post.title)}</h3>
                                        <span class="post-tag ${post.type === 'tutor_wanted' ? 'tag-tutor' : 'tag-student'}">
                                            ${post.type === 'tutor_wanted' ? '學生個案' : '導師列表'}
                                        </span>
                                    </div>
                                    <div class="post-meta" onclick="viewPost('${post.id}')" style="cursor: pointer;">
                                        ${post.subject ? `<span class="meta-item">📚 ${escapeHtml(post.subject)}</span>` : ''}
                                        ${postLocationDisplay ? `<span class="meta-item">📍 ${escapeHtml(postLocationDisplay)}</span>` : ''}
                                    </div>
                                    <p class="post-description" onclick="viewPost('${post.id}')" style="cursor: pointer;">${escapeHtml((post.description || '').substring(0, 80))}...</p>
                                    <div class="post-footer">
                                        <span class="post-author">${formatDate(post.created_at)} · ${post.status === 'active' ? '開放中' : '已關閉'}</span>
                                        <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); openDeletePostModal('${post.id}')">🗑️ 刪除</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="empty-state" style="padding: 30px;">
                        <p>尚未發布任何 Post</p>
                    </div>
                `}
            </div>
            
            ${reviewsReceived && reviewsReceived.length > 0 ? `
                <div class="profile-card" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 16px;">收到的評價</h3>
                    <div style="display: grid; gap: 16px;">
                        ${reviewsReceived.map(review => `
                            <div style="padding: 16px; background: var(--gray-100); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <strong>${escapeHtml(review.reviewer?.name || '匿名')}</strong>
                                    <span class="rating">${renderStars(review.rating)}</span>
                                </div>
                                ${review.comment ? `<p style="color: var(--gray-600);">${escapeHtml(review.comment)}</p>` : ''}
                                <p style="font-size: 12px; color: var(--gray-600); margin-top: 8px;">${formatDate(review.created_at)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        // Initialize avatar preview listener
        setupAvatarPreview();
        
    } catch (error) {
        console.error('Error loading profile:', error);
        content.innerHTML = `
            <div class="profile-card">
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>載入失敗</h3>
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }
}

async function loadMessages() {
    const list = document.getElementById('messagesList');
    if (!list) return;
    
    list.innerHTML = '<div class="empty-state">載入中...</div>';
    
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender: sender_id (name),
                receiver: receiver_id (name)
            `)
            .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!messages || messages.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>暫無訊息</h3>
                </div>
            `;
            return;
        }
        
        list.innerHTML = messages.map(msg => {
            const isSender = msg.sender_id === currentUser.id;
            const otherPerson = isSender ? msg.receiver : msg.sender;
            return `
                <div class="message-card ${!msg.is_read && !isSender ? 'unread' : ''}">
                    <div class="message-avatar">${(otherPerson?.name || 'U')[0].toUpperCase()}</div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-sender">${isSender ? '你' : escapeHtml(otherPerson?.name || '匿名')}</span>
                            <span class="message-time">${formatDate(msg.created_at)}</span>
                        </div>
                        <p class="message-text">${escapeHtml(msg.content)}</p>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading messages:', error);
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>載入失敗</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Open forgot password modal
function openForgotPasswordModal(event) {
    event.preventDefault();
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.classList.add('active');
}

// Handle forgot password
async function handleForgotPassword(event) {
    event.preventDefault();
    
    try {
        // Check if Supabase is initialized
        if (!supabase) {
            throw new Error('Supabase 未初始化，請重新整理頁面');
        }
        
        const email = document.getElementById('forgotPasswordEmail').value;
        
        // Simple email validation
        if (!email || !email.includes('@')) {
            showToast('請輸入有效的電郵地址', 'warning');
            return;
        }
        
        console.log('=== 開始密碼重設流程 ===');
        console.log('Email:', email);
        
        // Try to send password reset email with minimal options
        console.log('Calling supabase.auth.resetPasswordForEmail...');
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        
        console.log('Response data:', data);
        console.log('Response error:', error);
        
        if (error) {
            console.error('Full Supabase error object:', JSON.stringify(error, null, 2));
            
            // Provide more user-friendly error messages
            let errorMsg = error.message || '未知錯誤';
            
            if (error.status === 429 || error.message.includes('rate limit') || error.message.includes('too many')) {
                errorMsg = '請求太頻繁，請稍後再試';
            } else if (error.message.includes('Email not found') || error.message.includes('User not found')) {
                errorMsg = '此電郵地址尚未註冊';
            } else if (error.message.includes('smtp') || error.message.includes('email')) {
                errorMsg = '郵件發送失敗，請檢查 SMTP 設定';
            }
            
            throw new Error(errorMsg);
        }
        
        console.log('Password reset email sent successfully!');
        showToast('密碼重設連結已發送到您的電郵，請檢查收件箱（包括垃圾郵件）', 'success');
        closeModal('forgotPasswordModal');
        
    } catch (error) {
        console.error('=== 密碼重設失敗 ===');
        console.error('Error:', error);
        showToast(error.message || '發送失敗，請檢查 Console 了解詳情', 'error');
    }
}

// Open delete post confirmation modal
function openDeletePostModal(postId) {
    postToDelete = postId;
    const modal = document.getElementById('deletePostModal');
    if (modal) modal.classList.add('active');
}

// Confirm and delete post
async function confirmDeletePost() {
    if (!postToDelete) {
        showToast('未選擇要刪除的 Post', 'error');
        return;
    }

    if (!currentUser?.id) {
        showToast('請先登入', 'error');
        return;
    }

    const postId = postToDelete;
    
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        showToast('Post 已刪除', 'success');
        closeModal('deletePostModal');
        postToDelete = null;
        
        if (window.location.pathname.endsWith('profile.html') && typeof loadProfilePage === 'function') {
            await loadProfilePage();
        } else {
            window.location.href = 'profile.html';
        }
        
    } catch (error) {
        console.error('Error deleting post:', error);
        showToast(error.message || '刪除 Post 失敗', 'error');
    }
}

// Backward-compatible alias for any old callers.
async function handleDeletePost() {
    return confirmDeletePost();
}

function renderStars(count) {
    const filled = '★'.repeat(count);
    const empty = '☆'.repeat(5 - count);
    return filled + empty;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-HK', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    restoreAuthStateFromStorage();
    initSupabase();
});

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function handleProfileDistrictChange(checkbox) {
    if (!currentProfile) return;
    if (checkbox.checked) {
        if (!currentProfile.districts) currentProfile.districts = [];
        if (!currentProfile.districts.includes(checkbox.value)) {
            currentProfile.districts.push(checkbox.value);
        }
    } else {
        if (currentProfile.districts) {
            currentProfile.districts = currentProfile.districts.filter(d => d !== checkbox.value);
        }
    }
}

function handleTutorGradeChange(checkbox) {
    if (checkbox.checked) {
        if (!selectedTutorGrades.includes(checkbox.value)) {
            selectedTutorGrades.push(checkbox.value);
        }
    } else {
        selectedTutorGrades = selectedTutorGrades.filter(g => g !== checkbox.value);
    }
    updateTutorSubjectOptions();
}

function handleTutorSubjectChange(checkbox) {
    if (checkbox.checked) {
        if (!selectedTutorSubjects.includes(checkbox.value)) {
            selectedTutorSubjects.push(checkbox.value);
        }
    } else {
        selectedTutorSubjects = selectedTutorSubjects.filter(s => s !== checkbox.value);
    }
}

function handleTutorDistrictChange(checkbox) {
    if (!currentProfile) return;
    if (!currentProfile.districts) currentProfile.districts = [];
    if (checkbox.checked) {
        if (!currentProfile.districts.includes(checkbox.value)) {
            currentProfile.districts.push(checkbox.value);
        }
    } else {
        currentProfile.districts = currentProfile.districts.filter(d => d !== checkbox.value);
    }
}

function initPostDistrictOptions() {
    const container = document.getElementById('postDistrictOptions');
    if (!container) return;
    container.innerHTML = '';
    selectedPostDistricts = [];
    Object.keys(DISTRICT_MAP).forEach(mainDistrict => {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<label style="font-weight: 600; color: var(--gray-600); margin: 8px 0 4px; display: block;">${mainDistrict}</label>`;
        const subDiv = document.createElement('div');
        subDiv.style.display = 'flex';
        subDiv.style.flexWrap = 'wrap';
        subDiv.style.gap = '8px';
        DISTRICT_MAP[mainDistrict].forEach(subDistrict => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '6px';
            label.style.cursor = 'pointer';
            label.style.padding = '6px 12px';
            label.style.border = '1px solid var(--gray-200)';
            label.style.borderRadius = '6px';
            label.innerHTML = `
                <input type="checkbox" name="postDistricts" value="${subDistrict}" onchange="handlePostDistrictChange(this)">
                <span>${subDistrict}</span>
            `;
            subDiv.appendChild(label);
        });
        groupDiv.appendChild(subDiv);
        container.appendChild(groupDiv);
    });
}

function handlePostDistrictChange(checkbox) {
    if (checkbox.checked) {
        if (!selectedPostDistricts.includes(checkbox.value)) {
            selectedPostDistricts.push(checkbox.value);
        }
    } else {
        selectedPostDistricts = selectedPostDistricts.filter(d => d !== checkbox.value);
    }
}

function setupCreatePostPage() {
    const titleEl = document.getElementById('createPostTitle');
    
    if (currentProfile?.role === 'student') {
        selectedPostType = 'tutor_wanted';
        if (titleEl) titleEl.textContent = '發布學生個案';
        const budgetField = document.getElementById('budgetField');
        const rateField = document.getElementById('rateField');
        const experienceField = document.getElementById('experienceField');
        if (budgetField) budgetField.style.display = 'block';
        if (rateField) rateField.style.display = 'none';
        if (experienceField) experienceField.style.display = 'none';
    } else if (currentProfile?.role === 'tutor') {
        selectedPostType = 'student_wanted';
        if (titleEl) titleEl.textContent = '發布導師列表';
        const budgetField = document.getElementById('budgetField');
        const rateField = document.getElementById('rateField');
        const experienceField = document.getElementById('experienceField');
        if (budgetField) budgetField.style.display = 'none';
        if (rateField) rateField.style.display = 'block';
        if (experienceField) experienceField.style.display = 'block';
    }
    initPostDistrictOptions();
}

async function handleCreatePost(event) {
    event.preventDefault();
    console.log('📝 handleCreatePost 開始');
    console.log('👤 currentUser:', currentUser);
    console.log('👤 currentProfile:', currentProfile);
    console.log('📋 selectedPostType:', selectedPostType);
    console.log('📍 selectedPostDistricts:', selectedPostDistricts);
    
    if (!currentUser) { 
        console.log('❌ 未登入，跳轉到 auth 頁面');
        window.location.href = 'auth.html';
        showToast('請先登入', 'warning'); 
        return; 
    }
    
    if (currentProfile?.role === 'student' && selectedPostType !== 'tutor_wanted') {
        showToast('學生只能發布「學生個案」', 'error');
        return;
    }
    if (currentProfile?.role === 'tutor' && selectedPostType !== 'student_wanted') {
        showToast('導師只能發布「導師列表」', 'error');
        return;
    }

    if (selectedPostDistricts.length === 0) {
        showToast('請至少選擇一個地區', 'error');
        return;
    }
    
    const title = document.getElementById('postTitle')?.value || '';
    const subject = document.getElementById('postSubject')?.value || '';
    const teachingMode = document.getElementById('postTeachingMode')?.value || '';
    const description = document.getElementById('postDescription')?.value || '';
    const qualification = document.getElementById('postQualification')?.value || '';
    const budgetOrRateInput = selectedPostType === 'tutor_wanted' ? 
        document.getElementById('postBudget') : 
        document.getElementById('postRate');
    const budgetOrRate = budgetOrRateInput?.value || '';
    const teachingExperience = document.getElementById('postExperience')?.value || '';
    
    if (hasContactInfo(title) || hasContactInfo(description) || hasContactInfo(qualification) || hasContactInfo(teachingExperience)) {
        showToast('請勿在Post中留下聯絡方式', 'error');
        return;
    }
    
    try {
        const postCode = await generateAndSetPostCode();
        console.log('🏷️ 生成的 postCode:', postCode);
        
        const postData = {
            user_id: currentUser.id,
            type: selectedPostType,
            title,
            subject,
            teaching_mode: teachingMode,
            districts: selectedPostDistricts,
            district: selectedPostDistricts[0] || '',
            description,
            status: 'active'
        };
        
        if (postCode) postData.post_code = postCode;
        if (budgetOrRate) postData.budget_or_rate = parseInt(budgetOrRate);
        if (qualification) postData.qualification = qualification;
        if (teachingExperience) postData.teaching_experience = teachingExperience;
        
        console.log('📝 即將插入的 postData:', postData);
        
        const { error } = await supabase
            .from('posts')
            .insert(postData);
        
        if (error) throw error;
        
        console.log('✅ Post 發布成功！');
        showToast('Post 發布成功！', 'success');
        window.location.href = 'match.html';
        
    } catch (error) {
        console.error('❌ Error creating post:', error);
        showToast(error.message, 'error');
    }
}

async function loadProfilePage() {
    const content = document.getElementById('profileContent');
    if (!content) return;
    
    content.innerHTML = '<div class="empty-state">載入中...</div>';
    
    try {
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        const { data: reviewsReceived, error: reviewsError } = await supabase
            .from('reviews')
            .select(`
                *,
                reviewer: reviewer_id (name)
            `)
            .eq('target_id', currentUser.id);
        
        const averageRating = reviewsReceived && reviewsReceived.length > 0 ? 
            reviewsReceived.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsReceived.length : 0;
        
        const locationDisplay = (currentProfile?.districts || []).join(', ') || '';
        const gradeDisplay = currentProfile?.grade || '';
        
        let tutorInfo = '';
        if (currentProfile?.role === 'tutor' && currentTutorProfile) {
            tutorInfo = `
                <div class="profile-details" style="margin-top: 24px;">
                    <div class="detail-item">
                        <div class="detail-label">可補地區</div>
                        <div class="detail-value">${locationDisplay || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">可教年級</div>
                        <div class="detail-value">${(currentTutorProfile.can_teach_grades || []).join(', ') || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">可教科目</div>
                        <div class="detail-value">${(currentTutorProfile.subjects || []).join(', ') || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">每小時收費</div>
                        <div class="detail-value">$${currentTutorProfile.hourly_rate || 0}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">學歷</div>
                        <div class="detail-value">${currentTutorProfile.qualification || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">教學經驗</div>
                        <div class="detail-value">${currentTutorProfile.teaching_experience || '未設定'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">自我介紹</div>
                        <div class="detail-value" style="white-space: pre-wrap;">${escapeHtml(currentTutorProfile.self_introduction || '尚未填寫自我介紹')}</div>
                    </div>
                </div>
                <div style="margin-top: 16px; display: flex; gap: 12px;">
                    <button class="btn btn-secondary" onclick="toggleEditTutorProfile()" id="editTutorBtn">✏️ 編輯導師檔案</button>
                    <button class="btn btn-secondary" onclick="openAvatarUpload()">🖼️ 上傳頭像</button>
                </div>
                
                <div id="editTutorForm" style="display: none; margin-top: 24px;">
                    <form id="tutorEditForm" onsubmit="handleUpdateTutorProfile(event)">
                        <div class="form-group">
                            <label>可補地區（可多選）</label>
                            <div id="tutorDistrictOptions"></div>
                        </div>
                        <div class="form-group">
                            <label>可教年級</label>
                            <div id="tutorGradeOptions"></div>
                        </div>
                        <div class="form-group">
                            <label>可教科目</label>
                            <div id="tutorSubjectOptions"></div>
                        </div>
                        <div class="form-group" id="tutorOtherSubjectField" style="display: none;">
                            <label>其他科目</label>
                            <input type="text" class="form-control" id="tutorOtherSubject">
                        </div>
                        <div class="form-group">
                            <label>每小時收費</label>
                            <input type="number" class="form-control" id="tutorHourlyRate">
                        </div>
                        <div class="form-group">
                            <label>學歷</label>
                            <input type="text" class="form-control" id="tutorQualification">
                        </div>
                        <div class="form-group">
                            <label>教學經驗</label>
                            <input type="text" class="form-control" id="tutorExperience">
                        </div>
                        <div class="form-group">
                            <label>自我介紹</label>
                            <textarea class="form-control" id="tutorSelfIntroduction" rows="5" placeholder="簡單介紹你的教學風格、擅長科目、相關經驗等"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="toggleEditTutorProfile()">取消</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">儲存</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        content.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    ${currentProfile.role === 'tutor' && currentTutorProfile?.avatar_url ? 
                        `<img src="${currentTutorProfile.avatar_url}" class="profile-avatar" alt="${escapeHtml(currentProfile.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="profile-avatar" style="display:none">${(currentProfile.name || 'U')[0].toUpperCase()}</div>` : 
                        `<div class="profile-avatar">${(currentProfile.name || 'U')[0].toUpperCase()}</div>`}
                    <div class="profile-info">
                        <h2>${escapeHtml(currentProfile.name || currentUser.email)}</h2>
                        <p style="color: var(--gray-600);">${currentProfile.role === 'tutor' ? '導師' : '學生'}${locationDisplay ? ` · ${escapeHtml(locationDisplay)}` : ''}</p>
                        ${currentProfile.role === 'student' && gradeDisplay ? `<p style="color: var(--gray-600);">年級：${escapeHtml(gradeDisplay)}</p>` : ''}
                        <p style="color: var(--primary-color); font-weight: 600; margin-top: 4px;">用戶 ID: ${currentProfile?.user_code || '未設定'}</p>
                        ${averageRating > 0 ? `<div class="rating" style="margin-top: 8px;">${renderStars(Math.round(averageRating))} (${reviewsReceived.length} 則評價)</div>` : ''}
                    </div>
                </div>
                
                <div style="margin-bottom: 20px; text-align: right;">
                    <button class="btn btn-secondary" onclick="toggleEditProfile()" id="editProfileBtn">✏️ 編輯個人資料</button>
                </div>
                
                <div id="profileDetails">
                    <div class="profile-details">
                        <div class="detail-item">
                            <div class="detail-label">電郵</div>
                            <div class="detail-value">${escapeHtml(currentProfile.email || currentUser.email)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">電話</div>
                            <div class="detail-value">${escapeHtml(currentProfile.phone || '')}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">角色</div>
                            <div class="detail-value">${currentProfile.role === 'tutor' ? '導師' : '學生'}</div>
                        </div>
                        ${currentProfile.role === 'student' ? `
                            <div class="detail-item">
                                <div class="detail-label">可補習地區</div>
                                <div class="detail-value">${locationDisplay || '未設定'}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div id="editProfileForm" style="display: none;">
                    <form id="profileEditForm" onsubmit="handleUpdateProfile(event)">
                        <div class="form-group">
                            <label>姓名</label>
                            <input type="text" class="form-control" id="editName" value="${escapeHtml(currentProfile.name || '')}" required>
                        </div>
                        <div class="form-group">
                            <label>電話號碼</label>
                            <input type="tel" class="form-control" id="editPhone" value="${escapeHtml(currentProfile.phone || '')}" required>
                        </div>
                        <!-- ✅ 加入身份選擇 -->
                        <div class="form-group">
                            <label>身份</label>
                            <select class="form-control" id="editRole">
                                <option value="student" ${currentProfile.role === 'student' ? 'selected' : ''}>學生</option>
                                <option value="tutor" ${currentProfile.role === 'tutor' ? 'selected' : ''}>導師</option>
                            </select>
                            <p style="font-size: 12px; color: var(--gray-600); margin-top: 4px;">⚠️ 更改身份後，導師相關資料（可教科目、收費等）可能需要重新填寫</p>
                        </div>
                        ${currentProfile.role === 'student' ? `
                            <div class="form-group">
                                <label>可補習地區（可多選）</label>
                                <div id="editDistrictOptions"></div>
                            </div>
                        ` : ''}
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="toggleEditProfile()">取消</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">儲存</button>
                        </div>
                    </form>
                </div>
                
                ${tutorInfo}
            </div>
            
            <div class="profile-card" style="margin-top: 24px;">
                <h3 style="margin-bottom: 16px;">我的 Post</h3>
                ${posts && posts.length > 0 ? `
                    <div class="posts-grid">
                        ${posts.map(post => {
                            const postLocationDisplay = (post.districts || []).join(', ') || (post.district || '');
                            const postCode = post.post_code || '';
                            return `
                                <div class="post-card">
                                    <div class="post-header" onclick="viewPost('${post.id}')" style="cursor: pointer;">
                                        <h3 class="post-title">${postCode ? `<span style="color: var(--primary-color); font-weight:600;">${escapeHtml(postCode)}</span> · ` : ''}${escapeHtml(post.title)}</h3>
                                        <span class="post-tag ${post.type === 'tutor_wanted' ? 'tag-tutor' : 'tag-student'}">
                                            ${post.type === 'tutor_wanted' ? '學生個案' : '導師列表'}
                                        </span>
                                    </div>
                                    <div class="post-meta" onclick="viewPost('${post.id}')" style="cursor: pointer;">
                                        ${post.subject ? `<span class="meta-item">📚 ${escapeHtml(post.subject)}</span>` : ''}
                                        ${postLocationDisplay ? `<span class="meta-item">📍 ${escapeHtml(postLocationDisplay)}</span>` : ''}
                                    </div>
                                    <p class="post-description" onclick="viewPost('${post.id}')" style="cursor: pointer;">${escapeHtml((post.description || '').substring(0, 80))}...</p>
                                    <div class="post-footer">
                                        <span class="post-author">${formatDate(post.created_at)} · ${post.status === 'active' ? '開放中' : '已關閉'}</span>
                                        <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); openDeletePostModal('${post.id}')">🗑️ 刪除</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="empty-state" style="padding: 30px;">
                        <p>尚未發布任何 Post</p>
                    </div>
                `}
            </div>
            
            ${reviewsReceived && reviewsReceived.length > 0 ? `
                <div class="profile-card" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 16px;">收到的評價</h3>
                    <div style="display: grid; gap: 16px;">
                        ${reviewsReceived.map(review => `
                            <div style="padding: 16px; background: var(--gray-100); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <strong>${escapeHtml(review.reviewer?.name || '匿名')}</strong>
                                    <span class="rating">${renderStars(review.rating)}</span>
                                </div>
                                ${review.comment ? `<p style="color: var(--gray-600);">${escapeHtml(review.comment)}</p>` : ''}
                                <p style="font-size: 12px; color: var(--gray-600); margin-top: 8px;">${formatDate(review.created_at)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        setupAvatarPreview();
        
    } catch (error) {
        console.error('Error loading profile:', error);
        content.innerHTML = `
            <div class="profile-card">
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>載入失敗</h3>
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }
}

async function loadMessages() {
    const list = document.getElementById('messagesList');
    if (!list) return;
    
    list.innerHTML = '<div class="empty-state">載入中...</div>';
    
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender: sender_id (name),
                receiver: receiver_id (name)
            `)
            .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!messages || messages.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>暫無訊息</h3>
                </div>
            `;
            return;
        }
        
        list.innerHTML = messages.map(msg => {
            const isSender = msg.sender_id === currentUser.id;
            const otherPerson = isSender ? msg.receiver : msg.sender;
            return `
                <div class="message-card ${!msg.is_read && !isSender ? 'unread' : ''}">
                    <div class="message-avatar">${(otherPerson?.name || 'U')[0].toUpperCase()}</div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-sender">${isSender ? '你' : escapeHtml(otherPerson?.name || '匿名')}</span>
                            <span class="message-time">${formatDate(msg.created_at)}</span>
                        </div>
                        <p class="message-text">${escapeHtml(msg.content)}</p>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading messages:', error);
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>載入失敗</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function openForgotPasswordModal(event) {
    event.preventDefault();
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.classList.add('active');
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    try {
        if (!supabase) {
            throw new Error('Supabase 未初始化，請重新整理頁面');
        }
        
        const email = document.getElementById('forgotPasswordEmail').value;
        
        if (!email || !email.includes('@')) {
            showToast('請輸入有效的電郵地址', 'warning');
            return;
        }
        
        console.log('=== 開始密碼重設流程 ===');
        console.log('Email:', email);
        
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        
        console.log('Response data:', data);
        console.log('Response error:', error);
        
        if (error) {
            console.error('Full Supabase error object:', JSON.stringify(error, null, 2));
            
            let errorMsg = error.message || '未知錯誤';
            
            if (error.status === 429 || error.message.includes('rate limit') || error.message.includes('too many')) {
                errorMsg = '請求太頻繁，請稍後再試';
            } else if (error.message.includes('Email not found') || error.message.includes('User not found')) {
                errorMsg = '此電郵地址尚未註冊';
            } else if (error.message.includes('smtp') || error.message.includes('email')) {
                errorMsg = '郵件發送失敗，請檢查 SMTP 設定';
            }
            
            throw new Error(errorMsg);
        }
        
        console.log('Password reset email sent successfully!');
        showToast('密碼重設連結已發送到您的電郵，請檢查收件箱（包括垃圾郵件）', 'success');
        closeModal('forgotPasswordModal');
        
    } catch (error) {
        console.error('=== 密碼重設失敗 ===');
        console.error('Error:', error);
        showToast(error.message || '發送失敗，請檢查 Console 了解詳情', 'error');
    }
}

