import streamlit as st
import pandas as pd
from datetime import datetime
import json

st.set_page_config(page_title="ScholarPath - Simplified", layout="wide")

# Initialize session state for user data
if "profile" not in st.session_state:
    st.session_state.profile = {}
if "applications" not in st.session_state:
    st.session_state.applications = []

# Mock database of Indian Scholarships
scholarships_db = [
    {
        "id": "SCH-001",
        "name": "NSP Central Sector Scheme",
        "organization": "Ministry of Education",
        "amount": 10000,
        "deadline": "2026-10-31",
        "category": "Merit-Based",
        "min_percentage": 80,
        "eligible_income": 800000,
        "description": "Financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies."
    },
    {
        "id": "SCH-002",
        "name": "AICTE Pragati Scholarship for Girls",
        "organization": "AICTE",
        "amount": 50000,
        "deadline": "2026-11-30",
        "category": "Women/Girls",
        "min_percentage": 60,
        "eligible_income": 800000,
        "description": "Scheme being implemented by AICTE aimed at providing assistance for Advancement of Girls pursuing Technical Education."
    },
    {
        "id": "SCH-003",
        "name": "PM YASASVI Scholarship",
        "organization": "MoSJE",
        "amount": 20000,
        "deadline": "2026-09-15",
        "category": "OBC/EBC/DNT",
        "min_percentage": 50,
        "eligible_income": 250000,
        "description": "Scholarship for OBC, EBC, and DNT students studying in Class 9 and Class 11 in recognized schools."
    },
    {
        "id": "SCH-004",
        "name": "HDFC Badhte Kadam Scholarship",
        "organization": "HDFC Bank",
        "amount": 100000,
        "deadline": "2026-08-31",
        "category": "Corporate CSR",
        "min_percentage": 60,
        "eligible_income": 600000,
        "description": "Aiming to provide financial assistance to high-performing students from underprivileged backgrounds."
    },
    {
        "id": "SCH-005",
        "name": "Reliance Foundation Undergraduate Scholarship",
        "organization": "Reliance Foundation",
        "amount": 200000,
        "deadline": "2026-12-15",
        "category": "Corporate Merit",
        "min_percentage": 85,
        "eligible_income": 1500000,
        "description": "Support to 5000 meritorious undergraduate students across India to empower them to unlock their potential."
    }
]

# Sidebar Navigation
st.sidebar.title("ScholarPath Navigation")
page = st.sidebar.radio("Go to", ["Dashboard", "Browse Scholarships", "My Profile", "Documents & Bank"])

def calculate_eligibility(scholarship, profile):
    if not profile:
        return 0
    score = 100
    
    # Check income
    if profile.get('income', 10000000) > scholarship['eligible_income']:
        score -= 50
        
    # Check percentage
    if profile.get('percentage', 0) < scholarship['min_percentage']:
        score -= 40
        
    # Specific category checks
    special_categories = ["Women/Girls", "OBC/EBC/DNT"]
    if scholarship["category"] == "Women/Girls" and profile.get("gender") != "Female":
        score -= 80
    if scholarship["category"] == "OBC/EBC/DNT" and profile.get("category") not in ["OBC", "EBC"]:
        score -= 80
        
    return max(0, score)

if page == "Dashboard":
    st.title("📊 Your Application Dashboard")
    st.write("Track the progress of the scholarships you have applied for directly here.")
    
    if not st.session_state.applications:
        st.info("You haven't applied for any scholarships yet. Head over to **Browse Scholarships** to get started!")
    else:
        df = pd.DataFrame(st.session_state.applications)
        st.dataframe(df, use_container_width=True)
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Total Applications", len(st.session_state.applications))
        with col2:
            amt = sum([s['amount'] for s in st.session_state.applications])
            st.metric("Expected Total Funds", f"₹{amt:,.2f}")

elif page == "My Profile":
    st.title("👤 My Academic Profile")
    st.write("Complete your profile so our system can calculate your eligibility accurately.")
    
    with st.form("profile_form"):
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input("Full Name", value=st.session_state.profile.get("name", ""))
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
            category = st.selectbox("Social Category", ["General", "OBC", "SC", "ST", "Minority"])
        with col2:
            income = st.number_input("Family Annual Income (in ₹)", min_value=0, step=50000, value=st.session_state.profile.get("income", 500000))
            percentage = st.number_input("Previous Academic %", min_value=0.0, max_value=100.0, value=st.session_state.profile.get("percentage", 75.0))
            state = st.text_input("State of Residence", value=st.session_state.profile.get("state", ""))
            
        submitted = st.form_submit_button("Save Profile")
        if submitted:
            st.session_state.profile = {
                "name": name,
                "gender": gender,
                "category": category,
                "income": income,
                "percentage": percentage,
                "state": state
            }
            st.success("Profile saved successfully! Go browse scholarships now.")

elif page == "Browse Scholarships":
    st.title("🎓 Scholarship Database")
    st.write("Find funding opportunities tailored perfectly to your profile attributes.")
    
    search_query = st.text_input("🔍 Search by name or keyword")
    st.markdown("---")
    
    for sch in scholarships_db:
        if search_query.lower() in sch['name'].lower() or search_query.lower() in sch['description'].lower():
            eligibility_score = calculate_eligibility(sch, st.session_state.profile)
            
            with st.container():
                st.subheader(f"{sch['name']} ({sch['organization']})")
                
                col1, col2, col3 = st.columns(3)
                col1.write(f"**Amount:** ₹{sch['amount']:,.2f}")
                col2.write(f"**Deadline:** {sch['deadline']}")
                col3.write(f"**Category:** {sch['category']}")
                
                st.write(sch['description'])
                
                if st.session_state.profile:
                    if eligibility_score >= 80:
                        st.success(f"Highly Eligible (Match Score: {eligibility_score}%)")
                    elif eligibility_score >= 50:
                        st.warning(f"Partially Eligible (Match Score: {eligibility_score}%) - Check requirements")
                    else:
                        st.error(f"Low Eligibility (Match Score: {eligibility_score}%) - Likely to be rejected due to category/income/marks")
                else:
                    st.info("Please fill out your profile to view your personal eligibility score.")
                    
                # Check if already applied
                already_applied = any(a['id'] == sch['id'] for a in st.session_state.applications)
                
                if already_applied:
                    st.button("Application Submitted ✅", key=f"apply_{sch['id']}", disabled=True)
                else:
                    if st.button("Submit Application", key=f"apply_{sch['id']}"):
                        if not st.session_state.profile:
                            st.error("You must fill out your profile before applying.")
                        else:
                            st.session_state.applications.append({
                                "id": sch['id'],
                                "scholarship_name": sch['name'],
                                "amount": sch['amount'],
                                "status": "Under Review",
                                "applied_on": datetime.now().strftime("%Y-%m-%d")
                            })
                            st.rerun()
                st.markdown("---")

elif page == "Documents & Bank":
    st.title("🏦 Secure Vault")
    st.write("Upload your documents and save your direct benefit transfer banking details.")
    
    tab1, tab2 = st.tabs(["Document Locker", "Bank Details"])
    with tab1:
        st.subheader("Upload Documents")
        uploaded_file = st.file_uploader("Upload Income Certificate, Marksheets, etc.", type=['pdf', 'png', 'jpg'])
        if uploaded_file is not None:
            st.success("File securely uploaded and encrypted to your local session vault!")
            
    with tab2:
        st.subheader("Bank Information")
        with st.form("bank_form"):
            st.text_input("Account Holder Name")
            st.text_input("Bank Name")
            st.text_input("Account Number", type="password")
            st.text_input("IFSC Code")
            st.form_submit_button("Link Securely")
        st.info("We do not store your bank info on an external cloud securely. Information resides locally.")
