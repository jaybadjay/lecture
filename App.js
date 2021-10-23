//import logo from "./logo.svg";
//import shoebackground from "./wallpaper.jpg";
import "./App.css";
import React, { Component } from "react";
import Web3 from "web3";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home, Join, Board, Login } from "./routes";

const simpleTest = require("./abi/simpleTest.json");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      simpleTestInstance: null,

      defaultAccount: null,
      //payAccount: "0x0f5609373AF153b9eD217d6709Db2424F0a329a4",

      data: null,
      getData: null,
    };

    this.appResponse = "";
  }

  async componentWillMount() {
    this.appResponse = await this.getAppData();

    const web3 = new Web3(window.ethereum);
    const promise = await web3.eth.getAccounts(); //.then((accounts) => {
    //let Address = accounts[0];
    // get address of account in Metamask
    //console.log(Address);
    //return Address;
    //});
    const defaultAccount = await promise[0];
    const simpleTestInstance = new web3.eth.Contract(
      simpleTest,
      // "0x8540Ed903377cd33519603924aa9bC9c74560524"
      // "0x539A878Bb1b82D13E18A275899bd24923483d550"
      "0x10B643e8672858c0597b4622403c812eD2C3Cf35"
    );

    this.setState({
      web3: web3,
      simpleTestInstance: simpleTestInstance,
      defaultAccount: defaultAccount,
    });

    console.log(promise[0]);

    //this.render();
  }

  SetData = (e) => {
    //(수정필요)지갑연결이 되지 않았을 경우 에러창이 아닌 안내문구가 발생해야함
    e.preventDefault();
    this.state.simpleTestInstance.methods.enter().send({
      from: this.state.defaultAccount,
    });
    //(수정필요)트랜잭션이 완료된후 데이터를 보내야하는데 바로 보내게됨
    const dataBox = {
      inData: this.state.data,
    };
    fetch("http://localhost:3002/data", {
      //data 주소에서 받을 예정
      method: "post", //통신방법
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dataBox), //dataBox라는 객체를 보냄
    });
    //
  };
  ClearData = (e) => {
    e.preventDefault();
    this.state.simpleTestInstance.methods.clearArray().send({
      from: this.state.defaultAccount,
    });
  };

  getData = (e) => {
    e.preventDefault();
    this.state.simpleTestInstance.methods
      .checkBuyer()
      .call()
      .then((result) => {
        this.setState({
          getData: result,
        });
      });
  };

  // draw = (e) => {
  //   e.preventDefault();
  //   this.state.simpleTestInstance.methods.randomBuyer().call().then;
  // };

  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onMetaMask = (e) => {
    e.preventDefault();
    window.ethereum.request({ method: "eth_requestAccounts" });
  };

  toExpress = () => {
    const dataBox = {
      inData: this.state.data,
    };
    fetch("http://localhost:3002/data", {
      //text 주소에서 받을 예정
      method: "post", //통신방법
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dataBox), //dataBox라는 객체를 보냄
    });
  };

  async getAppData() {
    var url = "http://localhost:3002/users";

    var test = await axios.get(url);
    //console.log(test.data.products);
    var dataList = test.data.products;
    var makeString = "";

    for (var i = 0; i < dataList.length; i++) {
      // makeString = makeString + "id : " + dataList[i]["id"] + "\n";
      // makeString = makeString + "id : " + dataList[i]["username"] + "\n";
      makeString = makeString + dataList[i].company_id + "\n";
    }

    return makeString;
  }

  async componentDidMount() {
    //this.appResponse = await this.getAppData();
    //this.appResponse = this.getAppData();
  }
  render() {
    return (
      <Router>
        <div className="Background">
          <div className="ButtonBundle">
            <button
              onClick={this.onMetaMask}
              className="Button"
              style={{ fontWeight: "bold" }}
            >
              MetaMask Connect
            </button>

            <button className="Button">
              <Link
                to="/board"
                style={{
                  textDecorationLine: "none",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                DRAW
              </Link>
            </button>
            <button className="Button">
              <Link
                to="/login"
                style={{
                  textDecorationLine: "none",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                LOGIN
              </Link>
            </button>
            <button className="Button">
              <Link
                to="/join"
                style={{
                  textDecorationLine: "none",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                JOIN
              </Link>
            </button>
          </div>
          <hr />
          <div className="MainTitle">
            <h1>
              <Link to="/" style={{ textDecorationLine: "none" }}>
                <span className="Wims">WIMS</span>

                <br />
              </Link>
            </h1>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "-30px",
            }}
          >
            {/* WHERE&nbsp; IS&nbsp; MY&nbsp; SHOES? */}
            BLOCKCHAIN SHOES DRAW PLATFORM
          </div>
          <br />
          {/* 아무숫자 입력 : */}
          {/* <input type="text" name="data" onChange={this.handleChange}></input> */}
          {/* <button onClick={this.SetData}>응모</button>
          <br />
          참여자 확인하기<button onClick={this.getData}>클릭</button>
          <br />
          <button onClick={this.ClearData}>참여자 초기화</button>
          <br />
          <h1>{this.state.getData}</h1>
          <hr />
          <br /> */}
          {/* <h1>{this.appResponse}</h1> */}
          <hr />
          <Route exact path="/" component={Home} />
          <Route path="/join" component={Join} />
          <Route path="/board" component={Board} />
          <Route path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
