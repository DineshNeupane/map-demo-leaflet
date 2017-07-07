import Vue from 'vue';
import timestamp from '@/components/timestamp';

describe('timestamp.vue', () => {
  const Constructor = Vue.extend(timestamp);
  it('should correctly render the time', () => {
    const vm = new Constructor({ propsData: {
      date: '2017-06-05', time: '20:15',
    } }).$mount();
    expect(vm.$el.textContent)
      .to.equal('June 5th 2017, 20:15');
  });

  it('should correctly update the time', () => {
    const vm = new Constructor().$mount();
    vm.date = '2017-03-03';
    vm.time = '10:30';

    Vue.nextTick(() => {
      expect(vm.$el.textContent).to.equal('March 3rd 2017, 10:30');
    });
  });
});
