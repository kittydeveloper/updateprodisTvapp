import React from 'react';
import {
  View, StyleSheet, Text, ScrollView, Modal, TextInput, Dimensions, TouchableNativeFeedback
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faXmark, faInfoCircle, faChevronDown, faChevronUp ,faCheck} from '@fortawesome/free-solid-svg-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';


function TableComponent() {
  const CheckIcon = ({ selected }) => <FontAwesomeIcon icon={selected ? faCheck : ''} color='green' size={13} />;

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
  const [errorip, setErrorip] = useState('')
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

  const inputRef = useRef(null);

  //   var deviceWidth = Dimensions.get('window').width
  var deviceHeight = Dimensions.get('window').height


  const fetchData1 = async () => {
    const retrievedipf = await AsyncStorage.getItem('selectedValueipaddress');

    try {
      // console.log(retrievedipf, 'dpip')

      const response = await fetch(`http://${retrievedipf}:3004/getalltasks`);

      const jsonData = await response.json();
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
    const interval = setInterval(() => {
      fetchData1();

    }, 5000);
    return (() => clearInterval(interval));
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
      console.log(retrievedValue, 'valueseconds')
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

    setErrorip("")

    if (!validateipaddress(ipaddress)) {
      setErrorip("INValid IP Address")
      return

    }
    else {

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
      // const maxRow = Math.floor(contentHeightRef.current / rowHeightRef.current);

      if (nextRow >= alldata?.length) {
        const scrollToOffset = 0;
        scrollViewRef.current.scrollTo({ y: scrollToOffset, animated: true });
        currentRowRef.current = 0;
        return;
      }

      const scrollToOffset = nextRow * rowHeightRef.current;

      scrollViewRef.current.scrollTo({ y: scrollToOffset, animated: true });
      currentRowRef.current = nextRow;

      console.log(rowseconds, 'roweffect')
    }, parseInt(rowseconds, 10));

    return () => {
      clearInterval(scrollInterval);
    };
  }, [rowseconds, alldata]);

 
  const handleSort = (column, index) => {
    if (index == activeSort) {

      return (
        <>
          {!sortAscending ? (

            <TouchableNativeFeedback
              // background={TouchableNativeFeedback.Ripple("grey")}
              background={TouchableNativeFeedback.Ripple("lightgrey", true, 20)}
              onPress={() => { toggleSort1(column, index); setActiveSort(index) }}
            >
              <View style={{ paddingRight: 3 }}>
                <FontAwesomeIcon color="white" size={30} icon={faChevronDown}
                  style={{ color: '#424949', marginTop: 8, marginLeft: 5 }} />
              </View>
            </TouchableNativeFeedback>

          )
            :
            (

              <TouchableNativeFeedback
                
                background={TouchableNativeFeedback.Ripple("lightgrey", true, 20)}
                onPress={() => { toggleSort1(column, index); setActiveSort(index) }}
              >
                <View style={{ paddingRight: 3 }}>
                  <FontAwesomeIcon color="white" size={30} icon={faChevronUp}
                    style={{ color: '#424949', marginTop: 8, marginLeft: 5 }} />
                </View>
              </TouchableNativeFeedback>
            )
          }
        </>
      )
    }

    return (


      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("lightgrey", true, 20)}


        onPress={() => { toggleSort1(column, index); setActiveSort(index) }}
      >
        <View style={{ paddingRight: 3 }}>

          <FontAwesomeIcon color="white" size={30} icon={faChevronDown}
            style={{ color: '#424949', marginTop: 8, marginLeft: 5 }} />
        </View>
      </TouchableNativeFeedback>
    )
  }


  const toggleSort1 = (column, index) => {

    setSortAscending(!sortAscending);

    const sortedData = [...alldata].sort((a, b) => {
      //   console.log(a, 'aa')
      if (sortAscending) {
        if (column === "Date planned") {
          

          const [aDay, aMonth, aYear] = a['Date planned'].split('-');
          const [bDay, bMonth, bYear] = b['Date planned'].split('-');

          if (aYear !== bYear) {
            return aYear - bYear;
          }
          if (aMonth !== bMonth) {
            return aMonth - bMonth;
          }
          return aDay - bDay;

        } else {
          if (typeof (a[column]) === 'string' && typeof (b[column])) {
            // console.log('column')
            return a[column]?.localeCompare(b[column]);
          }
          else {
            return a[column] - b[column];
          }
        }
      } else {
        if (column === "Date planned") {
            

          const [aDay, aMonth, aYear] = a['Date planned'].split('-');
          const [bDay, bMonth, bYear] = b['Date planned'].split('-');
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


  const handleItemPress = async(value,label) => {
    console.log(value,label,"********")
    
    setROWseconds(value);
    // const selectedLabel =   items.find((item) => item.value === value)?.label;
    // setLabel(selectedLabel);
    setLabel(label)
    setOpen(false)


  };


  const renderListItem = ({ item, getLabel }) => {
    const selected = item.value === rowseconds;
    return(
    <View>
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("grey",)}
      onPress={() => handleItemPress(item.value,item.label)}>
      <View style={{  borderWidth: 0.3, borderColor: 'lightgrey',flexDirection:'row' ,justifyContent:'space-between'}}>
        <Text style={{ color: 'black' }}>{item.label}</Text>
        {selected && <CheckIcon selected={selected} />}
      </View>
    </TouchableNativeFeedback>
    </View>
  );
  }



  return (
    <>

      <View style={styles.container}>
       <View style={{ width: wp('100%'), height: hp('3%'), flexDirection: 'row', justifyContent: 'center', marginTop: deviceHeight * 0.001, backgroundColor: 'white' }}>
          <View style={{ width: wp('40%'), height: hp('3%'), flexDirection: 'row', justifyContent: 'center', marginLeft: -1 }}>
            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', letterSpacing: 3, }}>ProDis</Text>
          </View>
          <View style={{
            position: 'absolute', right: 13, padding: 1,
          }} >

            <TouchableNativeFeedback
          
              background={TouchableNativeFeedback.Ripple("grey", true, 10)}
              onPress={() => {
                setModalVisible(true)
              }}
               >
              <View>
                <FontAwesomeIcon icon={faGear} color='#0B3E5D' size={14} />
              </View>
            </TouchableNativeFeedback>
          </View>

        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            
            console.log("modal not closed")
            setModalVisible(!modalVisible);
          }}>

          <View style={[styles.centeredView, { marginTop: deviceHeight * -0.013 }]}>

            <View style={styles.modalView}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center', padding: 7,
                marginBottom: 10, backgroundColor: '#1976D2', width: 300,
                 marginLeft: -25, marginTop: -29,


              }}>
                <Text style={{
                  fontSize: 15,
                  color: 'white', marginLeft: 10
                }}>Settings</Text>
                <TouchableNativeFeedback
                  style={{ marginRight: 9 }}


                  background={TouchableNativeFeedback.Ripple("white", true, 15)}
                  onPress={() => { setModalVisible(!modalVisible); setOpen(false) }}>
                  <View>
                    <FontAwesomeIcon icon={faXmark} style={{ marginTop: 4 }} size={16} color='white' />
                  </View>
                </TouchableNativeFeedback>
              </View>
              <TouchableNativeFeedback
                onPress={() => { setModalAbout(true) }}
                background={TouchableNativeFeedback.Ripple("blue", true, 10)}
                style={{ borderRadius: 20 }}
              >
                <View style={{ position: 'absolute', right: 8, top: 37, borderRadius: 10 }}>

                  <FontAwesomeIcon icon={faInfoCircle} size={18} color='lightblue' />

                </View>
              </TouchableNativeFeedback>
              <View style={{ marginTop: 3 }}>
                <Text style={{ fontSize: 12, color: 'black' }}>Enter IP Address</Text>
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple("red")}
                  onPress={() =>  inputRef.current.focus() }
                >
                  <View style={[styles.section, { borderColor: 'lightblue' }]}>


                    <TextInput
                      style={[styles.inputStyle]}
                      value={ipaddress}
                      ref={inputRef}
                      onFocus={() => {

                        console.log('hellofocus')
                        setOpen(false)

                      }}
                      onChangeText={(value) => setIpaAddress(value)}
                      placeholder='Enter IP Address'
                      placeholderTextColor="#999999"
                    />

                  </View>
                </TouchableNativeFeedback>
                {errorip != "" ? (
                  <Text style={{ color: 'red', fontSize: 10, marginTop: 2 }}>
                    {" "}
                    {errorip}{" "}
                  </Text>
                ) : null}
                <View style={{ marginTop: errorip ? 5 : 10 }}>

                  <Text style={{ fontSize: 13, color: 'black' }}>Select Seconds</Text>
                  <TouchableNativeFeedback
                    style={{ borderWidth: 10 }}
                    background={TouchableNativeFeedback.Ripple("black")}
                    onPress={() => setOpen(true)}>
                    <View style={{ borderColor: 'lightgrey', borderWidth: 2 }}>
                      <DropDownPicker
                        style={{ borderRadius: 0, borderColor: 'white' ,fontSize:10}}
                      //  containerStyle={{height:15}}
                      dropDownContainerStyle={{borderColor:"grey",borderWidth:0.5,marginTop:-10}}
                      
                        open={open}
                        value={rowseconds}
                        items={items}
                        setOpen={setOpen}
                        setValue={setROWseconds}
                        //   setItems={setItems}
                        renderListItem={renderListItem}
                        dropDownDirection="AUTO"
                   

                      />
                    </View>
                  </TouchableNativeFeedback>


                </View>
              </View>
              {!open &&
                <TouchableNativeFeedback

                  background={TouchableNativeFeedback.Ripple("white")}
                  style={{ justifyContent: 'center' }}
                  onPress={handleStoredClick}>
                  <View style={{
                    width: 60, height: 30, justifyContent: 'center', textAlign: 'center',

                    marginLeft: 90, marginTop: 10, borderRadius: 5, borderWidth: 3, borderColor: 'grey',backgroundColor:'#1976D2'
                  }}>
                    <View style={{ }}>
                      <Text style={{ textAlign: 'center', padding: 1, color: 'white', }}>Save</Text>
                    </View>
                  </View>
                </TouchableNativeFeedback>
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

          <View style={[styles.centeredView1, { marginTop: deviceHeight * 0.01 }]}>

            <View style={styles.modalView1}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center', padding: 10,
                marginBottom: 10, backgroundColor: '#1976D2', width: 340, marginLeft: -25, marginTop: -35,
                borderTopRightRadius: 10, borderTopLeftRadius: 10


              }}>
                <Text style={{
                  fontSize: 15,
                  color: 'white', marginLeft: 10
                }}>About</Text>
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple("white", true, 15)}
                  style={{ marginRight: 9 }} onPress={() => setModalAbout(!modalAbout)}>
                  <View>

                    <FontAwesomeIcon icon={faXmark} style={{ marginTop: 4 }} size={15} color='white' />
                  </View>
                </TouchableNativeFeedback>
              </View>

              <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>

                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>ProDis</Text>
              </View>
              <View style={{ marginLeft: -21, marginTop: 18, flexDirection: 'row', justifyContent: 'center', width: 330 }}>
                <Text style={{ fontSize: 10, color: 'grey' }}><Text style={{ fontSize: 14, color: 'grey' }}>Copyright &#169;</Text>2023<Text style={{ color: 'grey' }}>SPATIAL Pvt Ltd. All rights reserved.</Text></Text></View>
            </View>
          </View>
        </Modal>

        {/* </View> */}
        <View style={{ flex: 1}}>
          <View style={styles.table1} >
            <View style={styles.row1} >
              {
                columns?.map((column, index) => (
                  <View style={{ flex: 1, flexDirection: 'row', color: '#fff', justifyContent: 'center', padding: 8, borderWidth: 2, borderColor: 'grey', flexWrap: 'wrap' }} key={index}>
                    <View>
                      <Text style={{ color: '#fff', fontSize: 35 }} >{column}</Text>
                    </View>
                    <View style={{ marginLeft: 3, marginTop: 2 }}>
                      {handleSort(column, index)}
                    </View>
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

                          <Text style={{ color: row.Priority === "Low" ? "green" : row.Priority === "low" ? "green" : row.Priority === "Medium" ? "yellow" : row.Priority === "medium" ? "yellow" : "red", fontSize: 40, }}>
                            {row[column]}

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

        <View style={{ backgroundColor: 'lightgrey', height: hp('2%'), width: wp('100%'), bottom: 3, justifyContent: 'center', alignItems: 'center', color: 'black' }}>
          <View>
            <Text style={{ fontSize: 10, color: 'black' }}>
              <Text style={{ fontSize: 10 }}> Copyright &#169;<Text style={{ fontSize: 10 }}>2023</Text>  SPATIAL Pvt Ltd. All rights reserved.
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
    
    width: 300,
    height:230,
  
    // width: wp('32%'),
    // height: hp('57%'),
    backgroundColor: 'white',
    padding: 25,
    marginTop: 30,

    marginRight: 7
  },
  modalView1: {
    width: 340,
    height: 130,
    // width: wp('35%'),
    // height: hp('36%'),
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

  section: {
    flexDirection: "row",
    height: 40,
    borderWidth: 2,

    backgroundColor: 'white',

    borderColor: "#dadae8",
  },
  dropdown: {
    height: 50,
    borderColor: '#dadae8',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,

  },
 iconStyle: {
    width: 10,
    height: 6,
  }, inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,

    backgroundColor: "white",

    borderColor: "#dadae8",
  },
});


