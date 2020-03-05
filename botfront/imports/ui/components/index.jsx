import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { getScopesForUser, areScopeReady, can } from '../../lib/scopes';


class Index extends React.Component {
    componentDidMount() {
        this.route();
    }

    componentDidUpdate(prevProps) {
        const { projectsReady } = this.props;
        if (projectsReady !== prevProps.projectsReady) {
            this.route();
        }
    }

    roleRouting = (pId) => {
        if (can('users:r', { anyScope: true })) {
            return '/admin/users';
        }
        if (can('roles:r', { anyScope: true })) {
            return '/admin/roles';
        }
        if (can('global-settings:r', { anyScope: true })) {
            return '/admin/settings';
        }
        if (can('analytics:r', pId)) {
            return `/project/${pId}/analytics`;
        }
        if (can('incoming:r', pId)) {
            return `/project/${pId}/incoming`;
        }
        if (can('stories:r', pId)) {
            return `/project/${pId}/stories`;
        }
        if (can('nlu-data:r', pId)) {
            return `/project/${pId}/nlu/models`;
        }
        if (can('responses:r', pId)) {
            return `/project/${pId}/dialogue/templates`;
        }
        return ('/404');
    };

    route = () => {
        const { router, projectsReady } = this.props;
        if (Meteor.userId()) {
            Tracker.autorun(() => {
                if (Meteor.user() && areScopeReady() && projectsReady) {
                    if (can('global-admin', undefined, Meteor.userId())
                        || can('projects:r', undefined, Meteor.userId())
                    ) router.push('/admin/projects');
                    else {
                        const projects = getScopesForUser(Meteor.userId(), '');
                        if (projects.length === 0) {
                            router.push('/404');
                        } else {
                            router.push(this.roleRouting(projects[0]));
                        }
                    }
                }
            });
        } else {
            router.push('/login/');
        }
    };

    render() {
        return <div />;
    }
}

Index.propTypes = {
    router: PropTypes.object.isRequired,
    projectsReady: PropTypes.bool.isRequired,
};

export default withTracker(() => {
    const projectsHandler = Meteor.subscribe('projects.names');

    return {
        projectsReady: projectsHandler.ready(),
    };
})(Index);
