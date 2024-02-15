// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import {getFirestore, collection, getDocs, getDoc, doc, setDoc,limit, Timestamp, onSnapshot} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
// import { getDatabase, ref, child, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// For Firebase JS SDK v7.20.0 and later, measurementId is optiona
const firebaseConfig = {
  apiKey: "AIzaSyDBdbu-84whBLw97Al4DYEk5uTNJEswKv4",
  authDomain: "pillgrim-1de80.firebaseapp.com",
  projectId: "pillgrim-1de80",
  storageBucket: "pillgrim-1de80.appspot.com",
  messagingSenderId: "248696586354",
  appId: "1:248696586354:web:86204ccec5359f57e202eb",
  measurementId: "G-19EYZSQ3BY"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let update_time = Timestamp.fromDate(new Date());
let interval = 10;
let count = 0;
let mday = 1;
let aday = 1
let eday = 1;
const teleUrl = "https://api.telegram.org/bot6246175382:AAFU9wnsIzrJ8nhk3j3AJIdbv8IVg2Rrh3s/sendMessage?chat_id=5467462666&text=time%20to%20take%20your%20pills";
let pillTime1 = "";
let pillTime2 = "";
let pillTime3 = "";

// HTML Elemets declaration
const timer_modal = document.getElementById('timer_modal');
const remainder = document.getElementById('set_remainder');
const pill_push_modal = document.getElementById('pill_push_modal');
const dispence_pill_btn = document.getElementById('pillDispence_btn')
const reload = document.getElementById('reload_opt');
const ultrasonic = document.getElementById('ultrasonic');
const add_med_opt = document.getElementById('add_med_opt');
const updateRef = collection(db,'Schedule');


// listening for update chk from the server
try{
  onSnapshot(updateRef, docsSnap =>{
    // console.log(docsSnap);
      docsSnap.forEach(doc => {
          if(doc){
              try{
                // Split the time string into hours, minutes, and seconds
                let [hour1, minute1, second1] = doc.data().Morning.split(':').map(Number);
                let [hour2, minute2, second2] = doc.data().Morning.split(':').map(Number);
                let [hour3, minute3, second3] = doc.data().Morning.split(':').map(Number);

                // Create a new Date object with the time
                pillTime1 = new Date();
                pillTime2= new Date();
                pillTime3 = new Date();

                pillTime1.setHours(hour1);
                pillTime2.setMinutes(minute1);
                pillTime3.setSeconds(second1);

                pillTime1.setHours(hour2);
                pillTime2.setMinutes(minute2);
                pillTime3.setSeconds(second2);

                pillTime1.setHours(hour3);
                pillTime2.setMinutes(minute3);
                pillTime3.setSeconds(second3);

              }catch(e){
                  console.error("Error creating object");
              }
          }
      });
  });
}catch(e){
  console.error("Error While Fetching realtime Update:   ",e);
}

function checkDailyUpdates() {
  if(pillTime1){
    const currentTime = new Date();
    if (pillTime1 < currentTime && count < interval) {
      fetch(teleUrl).then(response => {
        if (response.ok) {
        // Request was successful
        return response.json(); // If expecting JSON response
        } else {
        // Request failed
          throw new Error('HTTP request failed');
        }
      }).then(data => {
      // Handle the response data here
      console.log('Response Data:', data);
    }).catch(error => {
      // Handle any errors here
      console.error('Error:', error);
    });
    count++;
    }else{
      count = 0;
      if (pillTime2 < currentTime && count < interval) {
        fetch(teleUrl).then(response => {
          if (response.ok) {
          // Request was successful
          return response.json(); // If expecting JSON response
          } else {
          // Request failed
            throw new Error('HTTP request failed');
          }
        }).then(data => {
        // Handle the response data here
        console.log('Response Data:', data);
      }).catch(error => {
        // Handle any errors here
        console.error('Error:', error);
      });
      count++;
      }else{
        count = 0;
        if (pillTime3 < currentTime && count < interval) {
          fetch(teleUrl).then(response => {
            if (response.ok) {
            // Request was successful
            return response.json(); // If expecting JSON response
            } else {
            // Request failed
              throw new Error('HTTP request failed');
            }
          }).then(data => {
          // Handle the response data here
          console.log('Response Data:', data);
        }).catch(error => {
          // Handle any errors here
          console.error('Error:', error);
        });
        count++
        }else{
          count = 0;
        }
      }
    }
    console.log(currentTime); // This will print the time object
  }
}

// Set interval to check for updates every 24 hours (86,400,000 ms)
// const dailyUpdatesInterval = setInterval(checkDailyUpdates, 1000);

ultrasonic.addEventListener('click',async () =>{
  const update_doc = {
    ultrasonic: true,
    update_time: Timestamp.fromDate(new Date()),
    update_val: 7
  };
  await setDoc(doc(db,"Update","Update_chk"), update_doc);
});

reload.addEventListener('click', async () =>{
  console.log("reload");
  const update_doc = {
    ultrasonic: false,
    update_time: Timestamp.fromDate(new Date()),
    update_val: 7
  };
  await setDoc(doc(db,"Update","Update_chk"), update_doc);
});
dispence_pill_btn.addEventListener('click', () =>{
  pill_push_modal.style.display = 'flex';
  pill_push_modal.style.justifyContent = 'center';
  document.getElementById('morning_btn').addEventListener('click', async () =>{
    if(mday > 4){
      mday = 1;
    }
    const update_doc = {
      ultrasonic: false,
      update_time: Timestamp.fromDate(new Date()),
      update_val: 4
    };
    const update_e = {
      day: mday
    };
    await setDoc(doc(db,"Update","Update_chk"), update_doc);
    await setDoc(doc(db,"Update","Event"), update_e);
    mday++;
  });
  document.getElementById('afternoon_btn').addEventListener('click', async () =>{
    if(aday > 4){
      aday = 1;
    }
    const update_doc = {
      ultrasonic: false,
      update_time: Timestamp.fromDate(new Date()),
      update_val: 5
    };
    const update_e = {
      day: aday
    };
    await setDoc(doc(db,"Update","Update_chk"), update_doc);
    await setDoc(doc(db,"Update","Event"), update_e);
    aday++;
  });
  document.getElementById('evening_btn').addEventListener('clcik', async () => {
    if(eday>4){
      eday = 1;
    }
    const update_doc = {
      ultrasonic: false,
      update_time: Timestamp.fromDate(new Date()),
      update_val: 6
    };
    const update_e = {
      day: eday
    };
    await setDoc(doc(db,"Update","Update_chk"), update_doc);
    await setDoc(doc(db,"Update","Event"), update_e);
    eday++;
  });
});
remainder.addEventListener('click', async () => {
  timer_modal.style.display = 'flex';
  timer_modal.style.justifyContent = 'center';
  let temp_modal = document.getElementById('my_modal');
  temp_modal.style.display = 'content !important';
  let modal_close = document.getElementById('modal_close_btn');
  const docRef = doc(db, "Schedule", "Monday");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let morning = docSnap.data().Morning;
    let afternoon = docSnap.data().Afternoon;
    let evening = docSnap.data().Evening;
    let submit_btn = document.getElementById('modal_set_remainder');
    submit_btn.addEventListener('click',async ()=>{
      const morning_ele = document.getElementById("morning_inp");
      const afternoon_ele = document.getElementById("afternoon_inp");
      const evening_ele = document.getElementById("evening_inp");
      let morning_val = morning_ele.value;
      let afternoon_val = afternoon_ele.value;
      let evenin_val = evening_ele.value;
      // checking data
      console.log(morning_val,afternoon_val,evenin_val);
      if(morning_val == ""){
        morning_val = morning;
      }
      else{
        morning_val = morning_val + ":00";
      }
      if(afternoon_val == ""){
        afternoon_val = afternoon;
      }
      else{
        afternoon_val = afternoon_val + ":00";
      }
      if(evenin_val ==""){
        evenin_val = evening;
      }
      else{
        evenin_val = evenin_val + ":00";
      }
      const docData = {
        Morning: String(morning_val),
        Afternoon: String(afternoon_val),
        Evening: String(evenin_val)
      };
      const update_doc = {
        ultrasonic: false,
        update_time: Timestamp.fromDate(new Date()),
        update_val: 123
      };
      await setDoc(doc(db, "Schedule", "Monday"), docData);
      await setDoc(doc(db,"Update","Update_chk"), update_doc);
    });
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  modal_close.addEventListener('click',(e)=>{
    timer_modal.style.display = 'none';
  });
});
function addNotification(){
//   <li class="mb-2">
//   <a class="dropdown-item border-radius-md" href="javascript:;">
//     <div class="d-flex py-1">
//       <div class="my-auto">
//         <img src="https://img.icons8.com/cute-clipart/64/thumb-up.png" class="avatar avatar-sm bg-gradient-dark  me-3 " alt="thumb-up"/>
//         <!-- <img src="../assets/img/small-logos/logo-spotify.svg" class="avatar avatar-sm bg-gradient-dark  me-3 "> -->
//       </div>
//       <div class="d-flex flex-column justify-content-center">
//         <h6 class="text-sm font-weight-normal mb-1">
//           <span class="font-weight-bold">New Message</span>
//         </h6>
//         <p class="text-xs text-secondary mb-0 ">
//           <i class="fa fa-clock me-1"></i>
//           Medicine Taken On Time
//         </p>
//       </div>
//     </div>
//   </a>
// </li>
}