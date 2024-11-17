import React, { useState, useEffect } from "react";
import { FaStar, FaHistory, FaWallet} from "react-icons/fa";
import { IoIosArrowBack, IoIosSettings} from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { FiAlignLeft } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { HiOutlinePencil } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import './styles/main-app.css'
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import { S_BASE } from './components/supabase'


const url = "https://easy-as-backend.onrender.com"
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeCarousel />} />
        <Route path="/:USER/bookings" element={<Bookings />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tutor/:TTR_ID" element={<Tutor />}/>
        <Route path=":USER/sessions" element={<Sessions/>}/>
      </Routes>
    </Router>
  );
}


const HomeCarousel = () => {
  const [optionsTutors, setOptionsTutors] = useState([]);
  const navigate = useNavigate();

  const SEND_USER = (tutor) => {
    navigate(`/tutor/${tutor}`)
  }
  const fetchOptionsTutor = async() => {
    const {data, error} = await S_BASE.from('tutor_options').select('*');
    if(error) {
      console.error(error)
    } else {
      setOptionsTutors(data);
      console.log(data);
    }
  }
  useEffect(()=> {
    fetchOptionsTutor();
  }, [])
  return (
    <>
    <div className="disappearing-container">
      <div className="header-container">
        <h1 className="tutor-header">Tutors</h1>
        <p className="tutor-subline">Near you</p>
      </div>
      <Profile is_home={true} location={"/settings"}/>
    </div>
    <div className="tutors-container">
    {optionsTutors.map((tutor) => (
      <div className={`${"single-container tc-"+(tutor.utid-2)}`} onClick={()=> SEND_USER(tutor.tutor_id)}>
        <div className="home-name-container">
          <p>{tutor.first} {tutor.last}</p>
          <p>{tutor.qualification}</p>
        </div>
      </div>
    ))}
    </div>
    </>
  )
}

const Profile = ({ forceReload, is_home, location, f, l }) => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const fetchUserProfile = async () => {
    const { data, error } = await S_BASE.from('users').select('*').eq('id', 1).single(); 
    if (error) {
      console.error(error);
    } else {
      setProfile(data);
      console.log("Fetched Profile Data:", data);
    }
  };

  useEffect(() => {
    fetchUserProfile();    
  }, []);

  return (
    <div 
      className={`${is_home ? "user-container" : "settings-user"}`} 
      onClick={() => navigate(location)}
    >
      {!forceReload ? (
        profile.first && profile.last ? <span>{profile.first[0]}{profile.last[0]}</span> : ""
      ) : (
        <span>{f}{l}</span>
      )}
    </div>
  );
}

const Settings =  () => {
  const [profile, setProfile] = useState([]);
  const [showSetting, setShowSetting] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [updateName, setUpdateName] = useState("Null");
  const [updateLName, setUpdateLName] = useState("Null");
  const [name, setName] = useState(false);
  const navigate = useNavigate();
 
  const fetchUserProfile = async () => {
    const { data, error } = await S_BASE.from('users').select('*').eq('id', 1).single(); 
    if (error) {
      console.error(error);
    } else {
      setProfile(data);
      console.log("Fetched Profile Data:", data);
    }
  };
  
  useEffect(() => {
    fetchUserProfile();    
  }, []);

  const NameSetting = () => {
    setUpdateName(profile.first ? profile.first : "Null");
    setUpdateLName(profile.last ? profile.last : "Null");
    setShowHome(false);
    setName(true);
    setShowSetting(true);
  }

  const finishNameSetting = () => {
    setShowHome(true);
    setName(false);
    setShowSetting(false);
  }
  const finishAndUpdate = async (first, last, id) => {
    await UpdateName(first, last, id);
    fetchUserProfile();
    finishNameSetting();
  }    
  const UpdateName = async (first, last, id) => {
    const{error} = await S_BASE.from('users').update({first: first, last: last}).eq('id', id);
    if(error) console.error(error)
  }
  return(
    <>
    <div className={`profile-container ${showSetting ? "setting-active" : ""}`}>
      <div className="settings-header">
        <div className="back-container">
          <p className={`home ${showHome ? "" : "dont-show-home"}`} onClick={()=> navigate('/')}>done</p>
        </div>
        <h2 className="settings-title">Settings</h2>
      </div>
      <div className="all-settings">
      <div className="name-container card" onClick={()=> NameSetting()}>
        <Profile forceReload={true} f={profile.first ? profile.first[0] : "" } l={profile.last ? profile.last[0] : "" }/>
        <div className="name-content">
        <p className="settings-name">
          {profile.first && profile.last ? (
            (profile.first + profile.last).length < 15 ? 
              `${profile.first} ${profile.last}` : 
              profile.first
          ) : "Loading profile..."}
        </p>
        <p className="settings-details">Name & Contact Details</p>
        </div>
        <MdNavigateNext className="next-button" size={30}/>
      </div>
      <div className="setting-group">
        <div className="name-container card booking-setting" onClick={()=> navigate(`../${profile.user_id}/sessions`)}>
          <div className="b-set-logo">
            <div className="b-logo bl-logo">
              <FaChalkboardTeacher size={22}/>
            </div>
            <p className="booking-label">My Sessions</p>
          </div>
          <MdNavigateNext className="next-button" size={30}/>
        </div>
        <div className="name-container card booking-setting" onClick={()=> navigate(`../${profile.user_id}/bookings`)}>
          <div className="b-set-logo">
            <div className="b-logo">
              <FaHistory/>
            </div>
            <p className="booking-label">Bookings</p>
          </div>
          <MdNavigateNext className="next-button" size={30}/>
        </div>
        <div className="name-container card booking-setting" onClick={()=> navigate('')}>
          <div className="b-set-logo">
            <div className="b-logo w-logo">
              <FaWallet />
            </div>
            <p className="booking-label">Payment Methods</p>
          </div>
          <MdNavigateNext className="next-button" size={30}/>
        </div>
        <div className="name-container card booking-setting" onClick={()=> navigate('')}>
          <div className="b-set-logo">
            <div className="b-logo w-logo">
              <IoIosSettings className="cog" size={27}/>
            </div>
            <p className="booking-label">General</p>
          </div>
          <MdNavigateNext className="next-button" size={30}/>
        </div>
      </div>
    </div>
    </div>
    <div className={`name-context-wrapper ${name ? "wrapper-shown" : ""}`}>
      <div className="setting-name-context">
        <div className="fin-container">
          <div className="go-back-setting">
            <IoIosArrowBack className="home" onClick={() => finishNameSetting()}/>
            <p className="home" onClick={()=> finishNameSetting()}>Back</p>
          </div>
          <p className="name-header">Account Details</p>
          <p className={`${profile.first && profile.last ? (updateName === profile.first && updateLName === profile.last) ? "disabled" : "": ""} home`} onClick={() => {
              if (profile) {
                finishAndUpdate(updateName, updateLName, profile.id);
              }
            }}
          >
            Done
          </p>

        </div>
        <div className="name-in-setting">
          <div className="container-change">
            <div className="first-name name-indic">
              <p className="indicator">FIRST</p>
              <input className="name-label" type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
            </div>
            <div className="last-name name-indic">
              <p className="indicator">LAST</p>
              <input className="name-label" type="text" value={updateLName} onChange={(e) => setUpdateLName(e.target.value)}/>
            </div>
          </div>
          <p className="warning">*For demonstration, only first and last name can be updated.</p>
          <div className="container-change">
            <div className="first-name name-indic">
              <p className="indicator">PHONE</p>
              <input className="name-label" type="text" value={`+64 ${profile ? profile.phone_number : ""}`}/>
            </div>
            <div className="last-name name-indic">
              <p className="indicator">EMAIL</p>
              <input className="name-label" type="text" value={profile ? profile.email : ""}/>
            </div>
            <div className="user-name name-indic">
              <p className="indicator">TIER</p>
              <input className="name-label" type="text" value={profile ? profile.subscription_tier : ""}/>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Tutor = () => {
  const navigate = useNavigate();
  const {TTR_ID} = useParams();

  const [tutor, setTutor] = useState({})
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState({});

  const fetchCurrTutor = async() => {
    const {data, error} = await S_BASE.from('tutor_options').select('*').eq('tutor_id', TTR_ID).single();
    if(error) {
      console.error(error);
    } else {
      setTutor(data);
      // console.log(data);
    }
  }
  
  const fetchTutorSessions = async() => {
    const{data, error} = await S_BASE.from('sessions').select('*').eq('user_id', TTR_ID);
    error ? console.error(error) : setSessions(data);
    console.log(data);
  }

  const fetchUser = async() => {
    const{data, error} = await S_BASE.from('users').select('*').eq('id', 1).single();
    error ? console.error(error) : setUser(data);
    console.log(data);
  }

  useEffect(()=>{
    fetchCurrTutor();
    fetchTutorSessions();
    fetchUser();
  },[])

  const CheckBooked = (session, user) => {
    !session.is_booked ? MakeBooking(session.session_id, user) : console.log("already booked");
  }
  const MakeBooking= async(session, user) => {
    const {error} = await S_BASE.from('sessions').update({booked_user: user, is_booked: true}).eq("session_id", session);
    error ? console.error(error) : console.log("new booking");
    navigate(`../${user}/bookings`);
  }
  return (
    <>
    <div className="back-container">
      <IoIosArrowBack onClick={()=> navigate('/')}/>
    </div>
    <div className="detail-container">
      <div className={`${"single-container tc-"+(tutor.utid-2)} main-tutor-single`}>
      </div>
      <div className="information-container">
        <div className="single-name-container">
          <p>{tutor.first} {tutor.last}</p>
          <p>{tutor.qualification}</p>
        </div>
        <div className="actions">
          <FaStar />
          <BsThreeDots />
        </div>
      </div>
      <div className="address-container">
        {tutor.address}
        <p>Nearby</p>
      </div>
      <div className="sub-container">
        <h2>About me</h2>
        {tutor.bio}
      </div>
      <div className="sub-container">
        <h2>Sessions</h2>
        {sessions.map((session) => (
          <div className={`${session.is_booked ? "booked": ""} session-container`} key={session.id}>
            <div className="session-details">
              <p>{session.date}</p>
              <div className="small-container">
                <p>{session.time}</p>
                <p>${session.price}.00</p>
                {session.is_group ? <p className="group-indic">Group</p> : ""}
              </div>
            </div>
            <div className="cr-book" onClick={() => CheckBooked(session, user.user_id)}>
              <p>+</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

const Bookings = () => {
  const { USER } = useParams();  
  const [bookings, setBookings] = useState([]);
  const [showNickName, setShowNickname] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    console.log(USER)
    const {data, error} = await S_BASE.from('sessions').select('*').eq('booked_user', USER);
    error ? console.error(error) : setBookings(data)
    console.log(data);
  };

  const deleteBooking = async(id) => {
    const {error} = await S_BASE.from('sessions').update({booked_user: null, is_booked: false}).eq("session_id", id);
    error ? console.error(error) : console.log("deleted");
    window.location.reload();
  }
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <div className={`bookings-container ${showNickName ? 'scale-out' : ''}`}>
        <div className="home booking-go-back" onClick={() => navigate('/settings')}>
          <IoIosArrowBack className="back" />
          <p>Settings</p>
        </div>
        <h1 className="book-header">Your Bookings</h1>
        <div className="booking-container">
          {bookings.length > 0 ? bookings.map((b) => (
            <div className="booking" key={b.id}>
              <div className="book-text">
                {b.first.length > 19 ? (
                  <marquee className="book-name" behavior="" direction="">{b.first}</marquee>
                ): (
                  <p className="book-name">{b.first} {b.last}</p>
                )}
                <div className="book-when">
                  <p className="book-time">
                    {b.time}
                  </p>
                  <p className="book-date">{b.date}</p>
                </div>
              </div>
              <div className="action-buttons">
                <div className="update-button cancel-button" onClick={()=> console.log()}>
                  <HiOutlinePencil size={30} />
                </div>
                <div className="cancel-button" onClick={()=> deleteBooking(b.session_id)}>
                  <IoIosClose size={30} />
                </div>
              </div>
            </div>
          )) : (
            <div className="no-booking">
              <div className="no-book-logo">
                <FiAlignLeft size={100} />
              </div>
              <div className="no-book-text">
                <p className="no-book-par">No bookings available</p>
                <div className="active-send-no-book">
                  <p>click</p>
                  <p className="home no-book-home" onClick={() => navigate('/')}>here</p>
                  <p>to start booking</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Sessions = () => {
  const navigate = useNavigate();
  const {USER} = useParams();
  const [sessions, setSessions] = useState([]);
  const [showingSettings, setShowingSettings] = useState(false);
  const [ createContext, setCreateContext ] = useState(false);
  const [activeUser, setActiveUser] = useState({});


  const [time, setTime] = useState(0);
  const [date, setDate] = useState("");
  const [price, SetPrice] = useState(0);

  const displayCreateContext = ()=> {
    setShowingSettings(true);
    setCreateContext(true);
  }
  const hideCreateContext = () => {
    setShowingSettings(false);
    setCreateContext(false);
  }

  const fetchActiveUser = async() => {
    const {data, error} = await S_BASE.from('users').select('*').eq('user_id', USER).single();
    error ? console.error(error) : setActiveUser(data);
  }
  const getSessions = async() => {
    const {data, error} = await S_BASE.from('sessions').select('*').eq('user_id', USER);
    error ? console.error(error) : setSessions(data);
    console.log(data);
  }

  const createNewBooking = async(time, date, price) => {
    console.log(`time: ${time} date: ${date} price: ${price}`)
    if(time !== 0 || date !== "") {
      const newBooking = {
        user_id: activeUser.user_id,
        time: `${time}:00`,
        date: date,
        price: price,
        is_booked: false,
        is_group: false,
        session_id: crypto.randomUUID(),
        first: activeUser.first,
        last: activeUser.last
      }
      const {error} = await S_BASE.from('sessions').insert(newBooking)
      error ? console.error(error) : console.log("new")
      hideCreateContext();
      window.location.reload();
    } else {
      alert("Form incomplete")
    }
  }

  const DeleteBooking = async(id) => {
    const {error} = await S_BASE.from('sessions').delete().eq('session_id', id).single();
    error ? console.error(error) : console.log("deleted")
    window.location.reload();
  }
  useEffect(()=>{
    getSessions();
    fetchActiveUser();
  }, [])
   return (
    <>
    <div className={`${showingSettings ? "showSetting" : ""} screen`}>
      <div className="actions">
        <div className={`${showingSettings ? "disable-home" : ""} home booking-go-back`} onClick={() => navigate('/settings')}>
            <IoIosArrowBack className="back" />
            <p>Settings</p>
        </div>
        <div className="home new-container" onClick={()=> displayCreateContext()}>
          <p>New</p>
        </div>
      </div>
      {sessions.length > 0 ? (
        <div className="session-container-full">
          {sessions.map((session)=>(
            <div className={`${session.is_booked ? "booked": ""} session-container`} key={session.id}>
            <div className="session-details">
              <p>{session.date}</p>
              <div className="small-container">
                <p>{session.time}</p>
                <p>${session.price}.00</p>
                {session.is_group ? <p className="group-indic">Group</p> : ""}
              </div>
            </div>
            <div className="cr-book" onClick={() => DeleteBooking(session.session_id)}>
              <IoIosClose size={30}/>
            </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="empty-session-container">
          <p>You have no active sessions</p>
          <p>Click new to create a new session</p>
        </div>
      )}
    </div>

    <div className={`name-context-wrapper ${createContext ? "wrapper-shown" : ""}`}>
      <div className="setting-name-context">
        <div className="fin-container">
          <div className="go-back-setting">
            <IoIosArrowBack className="home" onClick={() => hideCreateContext()}/>
            <p className="home" onClick={()=> hideCreateContext()}>Back</p>
          </div>
          <p className="name-header">New Session</p>
          <p className={`hidden home`}
          >
            Done
          </p>

        </div>
        <div className="name-in-setting">
        <div className="container-change">
            <div className="first-name name-indic">
              <p className="indicator">TIME</p>
              <input className="name-label" type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Enter a time"/>
            </div>
            <div className="last-name name-indic">
              <p className="indicator">DATE</p>
              <input className="name-label" type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Enter a date"/>
            </div>
            <div className="last-name name-indic">
              <p className="indicator">Price</p>
              <input className="name-label" type="text" value={price} onChange={(e) => SetPrice(e.target.value)} placeholder="Enter a price"/>
            </div>
          </div>
          <div className={`finish-container update-complete ${time !== 0 && date !== "" ? 'enable' : ''}`} onClick={()=> createNewBooking(time, date, price)}>
            Create
          </div>
        </div>
      </div>
    </div>
    </>
  )
}