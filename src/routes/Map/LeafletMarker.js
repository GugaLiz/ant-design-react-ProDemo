import React, {PureComponent} from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import styles from './Marker.less';

import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { Content } = Layout;

//把图标重新引入
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.imagePath = '';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../assets/markers/marker-icon-2x.png'),
  iconUrl: require('../../assets/markers/marker-icon.png'),
  shadowUrl: require('../../assets/markers/marker-shadow.png'),
});

//处理每一个marker的显示
const PopupMarker = ({ children, position }) => {
    const items = children.map(item => (
      <span key={item.key}>
        {item.string}
        <br />
      </span>
    ));
  
    return (
      <Marker position={position}>
        <Popup>
          <div>{items}</div>
        </Popup>
      </Marker>
    );
  };
  //处理markerlist
  const MarkersList = ({ markers }) => {
    const items = markers.map(({ key, ...props }) => <PopupMarker key={key} {...props} />);
    return <div>{items}</div>;
  };

//连接models
@connect(({site,loading}) => ({site,loading:loading.models.site}))

export default class LeafletMarker extends PureComponent {
    //去拿mock的数据
    componentDidMount(){
       const {dispatch} = this.props;
       dispatch({
           type:'site/fetch',
       });
    }
    
    render() {
        const { site: { data }, loading } = this.props;
        //console.log({ data });
        const position = [22.7047, 113.302]; //中心点

        const dataList = { data }.data.list;

        let cellPoints = [];

        dataList.map(item => {
        let lng = Number.parseFloat(item.Lng);
        let lat = Number.parseFloat(item.Lat);
        let name = item.Name;
        let city = item.City || '';
        let district = item.District || '';
        let address = item.Address || '';
        let maintainer = item.Maintainer || '';
        let popupContent = [{key:city,string:`城市：${city}`},
        {key:name,string:`基站名称：${name}`},
        {key:lng,string:`经度：${lng}`},
        {key:lat,string:`纬度：${lat}`},
        {key:district,string:`地区：${district}`},
        {key:address,string:`地址：${address}`},
        {key:maintainer,string:`维护人员：${maintainer}`},
        ]
        cellPoints.push({key:name,position:[lat, lng],children:popupContent}); //重新组合marker数据
        });

        const style = {
            width: '100%',
            height: '600px',
          };
        return (
            <Content>
              <div className="ant-card-bordered" style={style}>
                <Map center={position} zoom={13} style={{ width: '100%', height: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MarkersList markers={cellPoints} />                 
                </Map>
              </div>
            </Content>
          );
    }
}