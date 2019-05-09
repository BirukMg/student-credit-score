<template>
  <v-app>
    <mdb-container>
      <!-- <button @click="some">OK</button> -->
      <!-- <p v-for="t in category">{{t}}</p> -->

        <club-activity></club-activity>

      <mdb-row>
        <mdb-col sm="4" v-for="(value,key) in category[0]">
          <mdb-container>
            <h3><mdb-badge color="default-color">{{key}}</mdb-badge></h3>
            <mdb-progress :value="value" style="background-color: #ccc"><strong>{{value}} %</strong></mdb-progress>
          </mdb-container>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </v-app>
</template>
<script>
  import axios from 'axios'
  import clubActivity from './MyClubActivity2'
  import {mdbContainer, mdbRow, mdbCol, mdbDoughnutChart,mdbProgress,mdbBadge} from 'mdbvue';
  export default {
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbDoughnutChart,
      mdbProgress,
      mdbBadge,
      clubActivity
    },
    data: function() {
      return {
       category: [],
       score: 50
     }
    },
    created(){
      // this.initialize()
      this.some()
    },
    methods: {
      // initialize(){
      //   axios.get('http://localhost:3000/api/cmems')
      //   .then(res => {
      //     console.log(res);
      //     // let cid = res.data[0].cid.substring(0,res.data[0].cid.length-3)
      //     // axios.get('http://localhost:3000/api/clubs')
      //     // .then(res => {
      //     //   console.log(res);
      //     // })
      //   })
      // }
      getCategory(){
        axios.get('http://localhost:3000/api/categories')
        .then(res => {
          // this.categories = res.data[0].category
          for (var i = 0; i < res.data[0].category.length; i++) {
            console.log(res.data[0].category[i]);
          }
        })
      },
      some(){
        let activityArr =[]
        let filterClub = {
          where : {
            login_id: this.$store.state.users + "_id"
          }
        }
        axios.get("http://localhost:3000/api/students?filter="+ JSON.stringify(filterClub))
        .then(studentRes => {
          // console.log(studentRes.data[0].student_id);
          axios.get('http://localhost:3000/api/categories')
          .then(categoryRes => {
            var arry = []
            var obj = {}
            // console.log(categoryRes);
            // this.categories = categoryRes.data[0].category
            for (var i = 0; i < categoryRes.data[0].category.length; i++) {
              // console.log(categoryRes.data[0].category[i]);
              let filterActivity = {
                where : {
                  sid: studentRes.data[0].student_id,
                  ccategory: categoryRes.data[0].category[i]
                }
              }
              axios.get("http://localhost:3000/api/cmems?filter="+ JSON.stringify(filterActivity))
              .then(cmemRes => {
                // console.log(cmemRes);
                arry = []
                  if (cmemRes.data.length != 0) {
                    for (var i = 0; i < cmemRes.data.length; i++) {
                      // activityArr.push(cmemRes.data[0].activity)
                      for (var variable in cmemRes.data[i].activity) {
                        if (cmemRes.data[i].activity.hasOwnProperty(variable)) {
                          // console.log(cmemRes.data[0].activity[variable]);
                          arry.push(cmemRes.data[i].activity[variable])
                        }
                      }
                      obj[cmemRes.data[i].ccategory] = this.sum(arry)/arry.length
                    }
                }
                this.category.push(obj)
              })
            }
          })
        })
      },
      initialize(){
        // console.log(this.$store.state.users + "_id");
        let filterClub = {
          where : {
            login_id: this.$store.state.users + "_id"
          }
        }
        axios.get("http://localhost:3000/api/students?filter="+ JSON.stringify(filterClub))
        .then(res => {
          this.sid =  res.data[0].student_id
          let filterClub = {
            where : {
              sid: res.data[0].student_id
            }
          }
          axios.get("http://localhost:3000/api/cmems?filter="+ JSON.stringify(filterClub))
          .then(res => {
            console.log(res);
            // for (var i = 0; i < res.data.length; i++) {
            //   let filterClubName = {
            //     where : {
            //       id: res.data[i].cid.substring(0,24)
            //     }
            //   }
            //   axios.get("http://localhost:3000/api/clubs?filter="+ JSON.stringify(filterClubName))
            //   .then(res => {
            //     // console.log(res);
            //     this.clubs.push(res.data[0].name)
            //     this.cid[res.data[0].name] = res.data[0].id
            //   })
            // }
          })
        })
      },
      sum(arr){
        var sum = arr.reduce(function(arr, b) { return arr + b; }, 0);
        return sum
      }
    }
  }
</script>
