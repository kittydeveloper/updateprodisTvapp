import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal, Pressable, TextInput, Image, Dimensions, RefreshControl
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpAZ, faArrowDownAZ, faGear, faXmark, faInfoCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TVEventHandler from 'react-native-tvos';

import DropDownPicker from 'react-native-dropdown-picker';

function TableComponent() {

  const [alldata, setAllData] = useState()
  const [columns, setColumns] = useState([]);
  const scrollViewRef = useRef(null)
  const [sortAscending, setSortAscending] = useState(true);
  const contentHeightRef = useRef(0);
  const scrollViewHeightRef = useRef(0);
  const rowHeightRef = useRef(0);
  const currentRowRef = useRef(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAbout, setModalAbout] = useState(false)
  const [ipaddress, setIpaAddress] = useState('');
  const [ipaddress1, setIpaAddress1] = useState('');
  const[errorip,setErrorip]=useState('')
  const [activeSort, setActiveSort] = useState(null);
  const [open, setOpen] = useState(false);
  const [rowseconds, setROWseconds] = useState('3000');
  const [label, setLabel] = useState('3s');
  const [items, setItems] = useState([
    { label: '1s', value: '1000' },
    { label: '2s', value: '2000' },
    { label: '3s', value: '3000' },
    { label: '4s', value: '4000' },
    { label: '5s', value: '5000' },
    { label: '6s', value: '6000' }
  ]);
  const [isPressed, setIsPressed] = useState(false);
  const inputRef = useRef(null);
  // const [focusedElement, setFocusedElement] = useState('ipaddress');



  var deviceWidth = Dimensions.get('window').width
  var deviceHeight = Dimensions.get('window').height
  console.log(deviceHeight, 'height', deviceWidth, 'width')
  // console.log(rowseconds,'row**********')
  // console.log(ipaddress,'ippppppp')
  

  

  const fetchData1 = async () => {
    const retrievedipf = await AsyncStorage.getItem('selectedValueipaddress');

    try {
      // console.log(retrievedipf,'dpip')

      const response = await fetch(`http://${retrievedipf}:3004/getalltasks`);

      const jsonData = await response.json();
      // console.log(jsonData, "RESPONSE")
      var columnNames = jsonData.columns
     
      setColumns(columnNames)
      setAllData(jsonData.tasks);
      return
    } catch (error) {
      setAllData([])
      setColumns([])
    
    }


  };

 useEffect(() => {
    const interval=setInterval(()=>{
      fetchData1();

    },5000);
    return(()=>clearInterval(interval));
  }, [ipaddress1]);
  
  useEffect(() => {
    // Check if the ref is available before trying to focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

   const storeSelectedseconds = async (value) => {
   
    try {

      await AsyncStorage.setItem('selectedValue', value);
      console.log('Selected value seconds stored successfully.');
    } catch (error) {
      console.log('Error storing selected value:', error);
    }
  };

  const storeSelectedipaddress = async (value1) => {

    try {

      await AsyncStorage.setItem('selectedValueipaddress', value1);
      console.log('Selected valueip stored successfully.');
    } catch (error) {
      console.log('Error storing selected value:', error);
    }
  };


  const fetchStoredipadderess = async () => {
    try {
      const retrievedip = await AsyncStorage.getItem('selectedValueipaddress');
      // console.log(retrievedip, 'ipdaddres')
      if (retrievedip !== null) {
        setIpaAddress(retrievedip);
        setIpaAddress1(retrievedip)

      }
    } catch (error) {
      console.log('Error retrieving stored value:', error);
    }
  };


  const fetchStoredValueseconds = async () => {
    try {
      const retrievedValue = await AsyncStorage.getItem('selectedValue');
      // console.log(retrievedValue, 'valueseconds')
      if (retrievedValue !== null) {
        setROWseconds(retrievedValue);
      }
    } catch (error) {
      console.log('Error retrieving stored value:', error);
    }
  };



  useEffect(() => {
    fetchStoredValueseconds();
    fetchStoredipadderess()


  }, [])

  const validateipaddress = (ip) => {
    const pattern = /^[0-9.]+$/;
    return pattern.test(ip)
  }
  const handleStoredClick = async () => {
    console.log('hiii save')
    setErrorip("")
    
    if(!validateipaddress(ipaddress)){
      setErrorip("INValid IP Address")
      return

    }
    else{
      console.log('hello')
    try {
      await storeSelectedipaddress(ipaddress);
      await storeSelectedseconds(rowseconds);
      setIpaAddress1(ipaddress)
      console.log('Values storedipaddress&&seconds successfully.');
    } catch (error) {
      console.log('Error storing values:', error);
    }
    setModalVisible(!modalVisible)
    fetchData1()
  }

  };
  const handleContentSizeChange = (contentWidth, contentHeight) => {

    contentHeightRef.current = contentHeight;
  };

  const handleLayout = (event) => {

    scrollViewHeightRef.current = event.nativeEvent.layout.height;
  };
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      const nextRow = currentRowRef.current + 1;
      const maxRow = Math.floor(contentHeightRef.current / rowHeightRef.current);

      if (nextRow >= alldata?.length) {
        const scrollToOffset = 0;
        scrollViewRef.current.scrollTo({ y: scrollToOffset, animated: true });
        currentRowRef.current = 0;
        return;
      }

      const scrollToOffset = nextRow * rowHeightRef.current;

      scrollViewRef.current.scrollTo({ y: scrollToOffset, animated: true });
      currentRowRef.current = nextRow;
     
      // console.log(rowseconds,'roweffect')
    }, parseInt(rowseconds, 10));

    return () => {
      clearInterval(scrollInterval);
    };
  }, [rowseconds, alldata]);

  function convertToSnakeCase(inputString) {
    return inputString.toLowerCase().replace(/\s+/g, '_');
  }

  function convertUnderscoreToSpace(inputString) {
    var string1 = inputString.replace("_", ' ');
    return string1.charAt(0).toUpperCase() + string1.slice(1);
  }
  const handleSort = (column, index) => {
    if (index == activeSort) {

      return (
        <>
          {!sortAscending ? (
            <TouchableOpacity style={{ marginTop: 15, marginLeft: 10 }} activeOpacity={0.2} onPress={() => { toggleSort1(convertToSnakeCase(column), index); setActiveSort(index) }} >

              <FontAwesomeIcon color="white" icon={faChevronDown}
                style={{ color: '#424949', fontSize: 15 }} />
            </TouchableOpacity>
          )
            :
            (
              <TouchableOpacity style={{ marginTop: 15, marginLeft: 10 }} activeOpacity={0.2} onPress={() => { toggleSort1(convertToSnakeCase(column), index); setActiveSort(index) }} >

                <FontAwesomeIcon color="white" icon={faChevronUp}
                  style={{ color: '#424949', fontSize: 15, }} />
              </TouchableOpacity>
            )
          }
        </>
      )
    }
    return (
      <TouchableOpacity style={{ marginTop: 15, marginLeft: 10 }} activeOpacity={0.2} onPress={() => { toggleSort1(convertToSnakeCase(column), index); setActiveSort(index) }} >

        <FontAwesomeIcon color="white" icon={faChevronDown}
          style={{ color: '#424949', fontSize: 15 }} />
      </TouchableOpacity>)
  }


  const toggleSort1 = (column, index) => {
    console.log(convertToSnakeCase(column), 'call', column, index)

    setSortAscending(!sortAscending);

    const sortedData = [...alldata].sort((a, b) => {
      console.log(a, 'aa')
      if (sortAscending) {
        if (column === "date_planned") {
          console.log(column, 'date1')

          const [aDay, aMonth, aYear] = a.date_planned.split('-');
          const [bDay, bMonth, bYear] = b.date_planned.split('-');

          if (aYear !== bYear) {
            return aYear - bYear;
          }
          if (aMonth !== bMonth) {
            return aMonth - bMonth;
          }
          return aDay - bDay;

        } else {
          if (typeof (a[column]) === 'string' && typeof (b[column])) {
            console.log('column')
            return a[column]?.localeCompare(b[column]);
          }
          else {
            return a[column] - b[column];
          }
        }
      } else {
        if (column === "date_planned") {
          console.log(column, 'date')

          const [aDay, aMonth, aYear] = a.date_planned.split('-');
          const [bDay, bMonth, bYear] = b.date_planned.split('-');
          if (aYear !== bYear) {
            return bYear - aYear;
          }
          if (aMonth !== bMonth) {
            return bMonth - aMonth;
          }
          return bDay - aDay;


        } else {
          if (typeof (a[column]) === 'string' && typeof (b[column])) {
            return b[column]?.localeCompare(a[column]);
          }
          else {
            return b[column] - a[column];
          }
        }
      }
    });

    setAllData(sortedData);
  };
  




  return (
    <>
      <View style={styles.container}>

        <View style={{ width: wp('100%'), height: hp('8%'), flexDirection: 'row', justifyContent: 'center',marginTop: deviceHeight * 0.001, backgroundColor: 'white' }}>
          <View style={{ width: wp('40%'), height: hp('8.3%'), flexDirection: 'row', justifyContent:'center',marginLeft: -1 }}>
            {/* <Image style={{ width: wp('11%'), height: hp('9%'), resizeMode: 'stretch', marginTop: 0 }} source={require('./newplan.png')} /> */}
            <Text style={{ color: 'black', fontSize: 34, fontWeight: 'bold', letterSpacing: 3, }}>ProDis</Text>
          </View>
          <View style={{position:'absolute',top:14,right:13,padding:3,backgroundColor: modalVisible? 'lightgrey' : '#ffffff', 
            borderRadius: modalVisible? 8:0,elevation:modalVisible? 80:0,}}>
         
          <TouchableOpacity 
          activeOpacity={0.8}
            onPress={() => {
              setIsPressed(true)
              setModalVisible(true)}
             
            }
        
            // style={{backgroundColor: modalVisible? 'lightblue' : '#ffffff', 
            // borderRadius: modalVisible? 8:0,elevation:modalVisible? 80:0,}} 
            >
            <FontAwesomeIcon icon={faGear}   color='#0B3E5D' size={22} />
          </TouchableOpacity>
          </View>
         
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            console.log("modal not closed")
            setModalVisible(!modalVisible);
          }}>

          <View style={[styles.centeredView, { marginTop: deviceHeight * 0.04, }]}>

            <View style={styles.modalView}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center', padding: 10,
                marginBottom: 10, backgroundColor: '#1976D2', width: wp('32%'), marginLeft: -35, marginTop: -35,


              }}>
                <Text style={{
                  fontSize: 20,
                  color: 'white', marginLeft: 10
                }}>Settings</Text>
                <TouchableOpacity style={{ marginRight: 9 }} onPress={() => setModalVisible(!modalVisible)}>
                  <FontAwesomeIcon icon={faXmark} style={{ marginTop: 4 }} size={20} color='white' />
                </TouchableOpacity>
              </View>
              <View style={{ position: 'absolute', right: 18, top: 52 }}>
                <TouchableOpacity onPress={() => {setIsPressed(false),setModalAbout(true)}} >
                  <FontAwesomeIcon icon={faInfoCircle} style={{}} size={24} color='lightblue' />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, color: 'black' }}>Enter IP Address</Text>
                <View style={styles.section}>


                  <TextInput
                    style={styles.inputStyle}
                    value={ipaddress}
                    // ref={inputRef}
                    autoFocus={true}
                  
                    onChangeText={(value) => setIpaAddress(value)}

                    placeholder='Enter IP Address'
                    placeholderTextColor="#999999"
                  />
                  
                </View>
                {errorip!= "" ? (
            <Text style={{color:'red',fontSize:13, marginTop:2}}>
              {" "}
              {errorip}{" "}
            </Text>
          ) : null}
                <View style={{ marginTop:errorip?5: 15}}>

                  <Text style={{ fontSize: 18, color: 'black' }}>Select Seconds</Text>
                 
                  <DropDownPicker
                    open={open}
                    value={rowseconds}
                    items={items}
                    setOpen={setOpen}
                    setValue={(value) => {
                      setROWseconds(value);
                      const selectedLabel = items.find((item) => item.value === value)?.label;
                      setLabel(selectedLabel);
                    }}
                    setItems={setItems}
                   />


                </View>
              </View>
              {!open &&
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, zIndex: 100 }}>

                  <TouchableOpacity style={{ backgroundColor: '#1976D2', width: 60, height: 30, borderRadius: 10 }} onPress={handleStoredClick}>
                    <Text style={{ textAlign: 'center', color: 'white', paddingTop: 2, fontSize: 18, letterSpacing: 1 }}>Save</Text>
                  </TouchableOpacity>
                </View>
              }
</View>
          </View>

        </Modal>

         <Modal
          animationType="fade"
          transparent={true}
          visible={modalAbout}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalAbout(!modalAbout);
            console.log("modal not closed")
          }}
          >

          <View style={[styles.centeredView1, { marginTop: deviceHeight * 0.1 }]}>

            <View style={styles.modalView1}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center', padding: 10,
                marginBottom: 10, backgroundColor: '#1976D2', width: wp('35%'), marginLeft: -25, marginTop: -35,
                borderTopRightRadius: 10, borderTopLeftRadius: 10


              }}>
                <Text style={{
                  fontSize: 20,
                  color: 'white', marginLeft: 10
                }}>About</Text>
                <TouchableOpacity style={{ marginRight: 9 }}  onPress={() => setModalAbout(!modalAbout)}>
                  <FontAwesomeIcon icon={faXmark} style={{ marginTop: 4 }} size={20} color='white' />
                </TouchableOpacity>
              </View>

              <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 40 }}>

                <Text style={{ fontSize: 20, fontWeight: 'bold',color:'black' }}>ProDis</Text>
              </View>
              <View style={{marginLeft:-21, marginTop: 26,flexDirection:'row',justifyContent:'center',width:wp('35%') }}>
                <Text style={{ fontSize: 13, color: 'grey' }}><Text style={{ fontSize: 17,color:'grey' }}>Copyright &#169;</Text>2023<Text style={{color:'grey'}}>SPATIAL Pvt Ltd. All rights reserved.</Text></Text></View>
            </View>
          </View>
        </Modal>

        {/* </View> */}
        <View style={{ flex: 1, padding: 7.5 }}>
          <View style={styles.table1} >
            <View style={styles.row1} >
              {
                columns?.map((column, index) => (
                  <View style={styles.headerCell} key={index}>
                    <TouchableOpacity activeOpacity={0.2}>
                      <Text style={{ flexDirection: 'row', color: 'white', fontSize: 32 }} >{convertUnderscoreToSpace(column)}</Text>

                    </TouchableOpacity>
                    {handleSort(column, index)}
                  </View>
                ))
              }
            </View>
            <ScrollView ref={scrollViewRef} pagingEnabled onContentSizeChange={handleContentSizeChange}
              onLayout={handleLayout}
              scrollEventThrottle={16}
            >
              {
                alldata?.map((row, rowIndex) => (
                  <View style={styles.row} key={rowIndex} onLayout={(event) => {
                    if (rowIndex === 0) {
                      rowHeightRef.current = event.nativeEvent.layout.height;
                    }
                  }} >

                    {columns.map((column, index) => (
                      <View style={[styles.cell, { backgroundColor: "black", flexWrap: 'wrap' }]} key={index}>
                        <View style={{ padding: 5 }}>

                          <Text style={{ color: row.priority === "Low" ? "green" : row.priority === "low" ? "green" : row.priority === "Medium" ? "yellow" : row.priority === "medium" ? "yellow" : "red", fontSize: 40, }}>
                            {row[convertToSnakeCase(column)]}

                          </Text>
                        </View>
                      </View>
                    ))}

                  </View>
                ))
              }
            </ScrollView>
          </View>
        </View>

        <View style={{ backgroundColor: 'lightgrey', height: hp('8%'), width: wp('100%'), bottom: 0, justifyContent: 'center', alignItems: 'center', color: 'black' }}>
          <View>
            <Text style={{ fontSize: 17, color: 'black' }}>
              <Text style={{ fontSize: 20 }}> Copyright &#169;<Text  style={{fontSize:16}}>2023</Text>  SPATIAL Pvt Ltd. All rights reserved.
              </Text></Text>
              </View>
         
        </View>
      </View>




    </>
  )
}

export default TableComponent


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 18,
    backgroundColor: 'white'
  },


  table1: {
    borderColor: 'black',
    borderWidth: 0.5,
    marginTop: 3,
    flex: 1,
    backgroundColor: 'black'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  row1: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  headerCell: {
    flex: 1,
    padding: 8,
    borderWidth: 2,
    borderColor: 'lightgrey',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',


  },
  headerCellText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  cell: {
    flex: 1,
    padding: 8,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'stretch',
    borderWidth: 1, flexWrap: 'wrap'


  },

  centeredView: {
    // marginTop: 22,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'

  },
  centeredView1: {

    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 50,
  },
  modalView: {
    // width: 300,
    // height: 300,
    width: wp('32%'),
    height: hp('57%'),
    backgroundColor: 'white',
    padding: 35,
    marginTop: 32,

    marginRight: 8
  },
  modalView1: {
    // width: 320,
    // height: 200,
    width: wp('35%'),
    height: hp('36%'),
    backgroundColor: 'white',
    padding: 25,
    marginTop: 31,
    borderRadius: 10,
    marginRight: 14
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    flexDirection: "row",
    height: 50,
    borderWidth: 2,

    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: "#dadae8",
  },
  dropdown: {
    height: 50,
    borderColor: '#dadae8',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,

  },


  placeholderStyle: {
    fontSize: 16,
    color: '#999999',
    paddingLeft: 10
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
    borderRadius: 5,
  },
  iconStyle: {
    width: 10,
    height: 6,
  }, inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    // borderWidth: 1,
    // borderRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",

    borderColor: "#dadae8",
  },
  dropdown1: {
    // width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownContainer: {
    width: 210,
    marginTop: 8,
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 7,

  },
  dropdownItemText: {
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 19,

  },
  defaultText: {
    color: 'black',
    fontSize: 15
    // additional styles for the default value
  },
});


