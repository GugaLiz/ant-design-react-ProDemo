import React,{ PureComponent } from 'react';
import{ connect } from 'dva';
import { Tabs, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MapForm.less';

import LeafletMarker from './LeafletMarker';
import ClusterMarker from './ClusterMarker';

const TabPane = Tabs.TabPane;

export default class MapForm extends PureComponent {
    render(){
        return (
            <PageHeaderLayout>
                <div className={styles.card}>
                    <Tabs type="card">
                        <TabPane tab="LeafletMarker" key="1">
                            <LeafletMarker />
                        </TabPane>
                        <TabPane tab="ClusterMarker" key="2">
                            <ClusterMarker />
                        </TabPane>
                    </Tabs>
                </div>
            </PageHeaderLayout>
        )
    }
}