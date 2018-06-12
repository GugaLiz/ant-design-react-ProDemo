import React, { PureComponent} from 'react';
import {connect} from 'dva';
import {Layout} from 'antd';
import styles from './Marker.less';

import L from 'leaflet';
import { Map, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import 'leaflet/dist/leaflet.css';

const {Content} = Layout;

//把图标重新引入
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.imagePath = '';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../assets/markers/marker-icon-2x.png'),
  iconUrl: require('../../assets/markers/marker-icon.png'),
  shadowUrl: require('../../assets/markers/marker-shadow.png'),
});

//连接model的site.js
@connect(({site,loading}) => ({site,loading:loading.models.site}))

export default class ClusterMarker extends PureComponent {
    //去获取mock文件夹site.js的数据
    componentDidMount(){
        const {dispatch} = this.props;
        dispatch({
            type:'site/fetch',
        });
     }
    
    render(){
        const { site: { data }, loading } = this.props;
        //console.log({ data });
        const position = [22.7047, 113.302]; //中心点

        const dataList = { data }.data.list; //取出我们需要的数据

        let cellPoints = [];

        dataList.map(item => {
        let lng = Number.parseFloat(item.Lng);
        let lat = Number.parseFloat(item.Lat);
        let name = item.Name;
        let city = item.City || '';
        let district = item.District || '';
        let Address = item.Address || '';
        let maintainer = item.Maintainer || '';
        let popupDiv = `<div style={stylep}>
        <span>城市：${city}</span>
        <br />
        <span>基站名称：${name}</span>
        <br />
        <span>经度：${lng}</span>
        <br />
        <span>纬度：${lat}</span>
        <br />
        <span>地区：${district}</span>
        <br />
        <span>地址：${Address}</span>
        <br />
        <span>维护人员：${maintainer}</span>
        <br />
        </div>`;
        cellPoints.push({ position: [lat, lng], popup: popupDiv }); //重新组合marker内容
        });

        const style = {
            width: '100%',
            height: '600px',
          };

          //定义聚合点样式
        const createClusterCustomIcon = function(cluster) {
            return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: styles.markercustom,
            iconSize: L.point(40, 40, true),
            });
        };
  
        return (
            <Content>
            <div className="ant-card-bordered" style={style}>
                <Map center={position} zoom={13} style={{ width: '100%', height: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MarkerClusterGroup
                  spiderfyDistanceMultiplier={2}
                  iconCreateFunction={createClusterCustomIcon}
                  markers={cellPoints}
                />
                  
                </Map>
              </div>
            </Content>
        )
    }
}