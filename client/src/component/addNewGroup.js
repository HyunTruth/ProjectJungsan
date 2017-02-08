import React from 'react';
import axios from 'axios';

export default class AddNewGroup extends React.Component {

  constructor() {
    super();
    this.state = {
      groupname: '',
      groupmembers: [],
      emailToBeChecked: '',
      errorMemberDuplicate: '',
      errorGroupnameDuplicate: '',
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleAddMember = this.handleAddMember.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleGroupName = this.handleGroupName.bind(this);
    this.handleMemberDelete = this.handleMemberDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    axios.post('http://localhost:3000/api/group', {
      groupname: this.state.groupname,
      groupmembers: this.state.groupmembers,
    })
    .then((res) => {
      console.log('post response:', res);
    })
    .catch((err) => {
      console.log('error!!: ', err);
    });
  }
  handleInput(event) {
    if (event.target.className === 'inputGroupName') {
      this.setState({
        groupname: event.target.value,
      });
    }
    else if (event.target.className === 'addGroupMembers') {
      // console.log(this.state.emailToBeChecked)
      this.setState({
        emailToBeChecked: event.target.value
      });
    }
  }

  handleAddMember() {
    const reset = document.body.getElementsByClassName('addGroupMembers')[0].value;
    // console.log(document.body);
    // console.log(document.body.getElementsByClassName('addGroupMembers'))
    document.body.getElementsByClassName('addGroupMembers')[0].value =  '';

    axios.get(`http://localhost:3000/api/group?target=email&email=${this.state.emailToBeChecked}`)
    .then((res) => {
        console.log(res.data);
        const data = JSON.parse(res.data);
        if (data.length) {
            const nextGroupmembers = this.state.groupmembers;

            const emailCheck = this.state.groupmembers.some((item) => {
              return item.email === data[0].email
            });
            console.log(emailCheck)
            if (!emailCheck) {
                nextGroupmembers.push({
                  username: data[0].username,
                  email: data[0].email,
                });
                this.setState({groupmembers: nextGroupmembers, errorMemberDuplicate: ''});
            } else {
                this.setState({errorMemberDuplicate: 'user is already added!'});
            }
        } else {
            this.setState({errorMemberDuplicate: 'user email does not exist!'});
        }
    });
  }

  handleKeyPress(event) {

    if (event.charCode === 13) {
      if (event.target.className === 'addGroupMembers')
        this.handleAddMember();
      else {
        this.handleGroupName();
      }
    }
  }

  handleGroupName() {
    axios.get(`http://localhost:3000/api/group?target=groupname&groupname=${this.state.groupname}`)
    .then((res) => {
      const data = JSON.parse(res);
      if(data.length) {
        this.setState({
          errorGroupnameDuplicate: 'Group Name already exist. Try another Group Name!'
        })
      }
      else {
        this.setState({
          groupname: data[0],
          errorGroupnameDuplicate: '',
        })
      }
    })
  }

  handleMemberDelete(event) {
    const NextGroupmembers = [...this.state.groupmembers];
    NextGroupmembers.forEach((data, index) => {
      if(data.email === event.target.name) {
        NextGroupmembers.splice(index, 1);
      }
    })
    this.setState({
      groupmembers: NextGroupmembers,
      errorMemberDuplicate: '',
    })
  }

  render() {
    const groupMembers = this.state.groupmembers.map((data) => {
      return <p>{data.username} ({data.email}) <input type="submit" value="delete" name={data.email} onClick={this.handleMemberDelete} /></p>
    })

    return (
      <div>
        New Group Name:
        <input type="text" className='inputGroupName'
          onChange={this.handleInput} onKeyPress={this.handleKeyPress}/>
          <input type="submit" value="중복확인" onClick={this.handleGroupName} />
        <p className="errorGroupnameDuplicate">{this.state.errorGroupnameDuplicate} </p>
        <br />
        <br />
        Add Members:
        <input type="text" className="addGroupMembers" placeholder='ex) wnghee91@gmail.com'
          onChange={this.handleInput} onKeyPress={this.handleKeyPress}/>
        <input type="submit" onClick={this.handleAddMember} value="add"/>
        <p className="errorMemberDuplicate">{this.state.errorMemberDuplicate} </p>
        <br />
        <br />
        Following Members will be added to your group: {this.state.groupname}
        <br />
        {groupMembers}
        <br />
        <br />
        <input type="submit" onClick={this.handleSubmit} className="submitNewGroup" />
      </div>
    )
  }

}
