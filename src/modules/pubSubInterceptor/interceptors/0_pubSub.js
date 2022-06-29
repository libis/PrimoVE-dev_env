//Must be loaded first can't change order because of how babel-plugin-import-directory works.
import PrimoPubSub from '../pubSub';
window.pubSub = new PrimoPubSub();
import * as blendedSearchAddParams from './1_blendedSearch/blended_search.json';
window.blendedSearchAddParams = blendedSearchAddParams;